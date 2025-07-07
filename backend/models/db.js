// Environment-aware database setup
// Uses PostgreSQL in production (Railway) and SQLite for local development.

let db;

if (process.env.DATABASE_URL) {
    // Production: Use PostgreSQL
    console.log('🐘 Production environment detected (DATABASE_URL is set). Using PostgreSQL.');
    const { Pool } = require('pg');

    const poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    };

    db = new Pool(poolConfig);

    // Test the connection
    db.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('❌ Error connecting to PostgreSQL:', err);
        } else {
            console.log('✅ Connected to PostgreSQL successfully at:', res.rows[0].now);
        }
    });

} else {
    // Development: Use SQLite
    console.log('🐘 Development environment detected. Using SQLite.');
    try {
        const Database = require('better-sqlite3');
        const path = require('path');
        const dbPath = path.resolve(__dirname, '..', 'biomvp.sqlite');
        
        console.log('🗄️ Initializing SQLite database at:', dbPath);
        db = new Database(dbPath, { verbose: console.log });
        
        // Initialize database schema if needed
        initializeDatabase();
        
    } catch (error) {
        console.error('SQLite initialization failed:', error);
        throw error;
    }
}

function initializeDatabase() {
    console.log('📋 Initializing SQLite database schema...');
    
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
    
    console.log('✅ SQLite database schema initialized');
}

module.exports = db;
