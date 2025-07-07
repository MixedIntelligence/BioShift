// Railway-compatible database setup
// Uses SQLite locally, PostgreSQL or mock data on Railway for compatibility

let db;

if (process.env.DATABASE_URL) {
    // PostgreSQL for Railway production
    console.log('🐘 Using PostgreSQL database');
    const { Pool } = require('pg');
    
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    db = pool;
    
} else if (process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production') {
    // Fallback mock database for Railway if PostgreSQL not available
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('!!! CRITICAL: DATABASE_URL NOT FOUND IN PRODUCTION !!!');
    console.error('!!! FALLING BACK TO MOCK DATABASE !!!');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('🚂 Railway fallback - using mock database with test users');
    
    // Mock database with pre-seeded test users
    const mockUsers = [
        { id: 1, email: 'test@example.com', password_hash: '$2a$10$rOvHl3CygX9eGaFeNBEYmeE8ZJAOm5F8.vNEU2RzZgKJNj1tUH8.W', role: 'Worker', created_at: '2025-07-06 12:00:00' },
        { id: 2, email: 'lab@example.com', password_hash: '$2a$10$rOvHl3CygX9eGaFeNBEYmeE8ZJAOm5F8.vNEU2RzZgKJNj1tUH8.W', role: 'Lab', created_at: '2025-07-06 12:00:00' },
        { id: 3, email: 'provider@example.com', password_hash: '$2a$10$rOvHl3CygX9eGaFeNBEYmeE8ZJAOm5F8.vNEU2RzZgKJNj1tUH8.W', role: 'Provider', created_at: '2025-07-06 12:00:00' }
    ];
    
    db = {
        prepare: (query) => ({
            run: (...args) => ({ changes: 1, lastInsertRowid: mockUsers.length + 1 }),
            get: (...args) => {
                if (query.includes('SELECT * FROM users WHERE email = ?')) {
                    return mockUsers.find(u => u.email === args[0]) || null;
                }
                if (query.includes('SELECT * FROM users WHERE id = ?')) {
                    return mockUsers.find(u => u.id === args[0]) || null;
                }
                return null;
            },
            all: (...args) => {
                if (query.includes('FROM users')) {
                    return mockUsers;
                }
                return [];
            }
        }),
        exec: (query) => true,
        close: () => true,
        transaction: (fn) => fn
    };
    
} else {
    // Local development with SQLite
    console.log('🚂 Local development - using SQLite');
    try {
        const Database = require('better-sqlite3');
        const path = require('path');
        const dbPath = path.resolve(__dirname, '..', 'biomvp.sqlite');
        db = new Database(dbPath, { verbose: console.log });
        
        // Initialize database schema if needed
        initializeDatabase();
        
    } catch (error) {
        console.error('SQLite initialization failed:', error);
        throw error;
    }
}

function initializeDatabase() {
    console.log('📋 Initializing database schema...');
    
    // Create users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'Worker',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    
    // Create other essential tables
    db.exec(`
        CREATE TABLE IF NOT EXISTS user_skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            skill TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);
    
    db.exec(`
        CREATE TABLE IF NOT EXISTS user_education (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            institution TEXT NOT NULL,
            degree TEXT NOT NULL,
            field_of_study TEXT,
            start_year INTEGER,
            end_year INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);
    
    db.exec(`
        CREATE TABLE IF NOT EXISTS user_publications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            journal TEXT,
            year INTEGER,
            url TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);
    
    console.log('✅ Database schema initialized');
}

module.exports = db;
