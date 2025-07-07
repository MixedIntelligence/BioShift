// Railway-compatible database setup
// Uses SQLite with proper initialization for both local and Railway deployment

let db;

try {
    const Database = require('better-sqlite3');
    const path = require('path');
    const dbPath = path.resolve(__dirname, '..', 'biomvp.sqlite');
    
    console.log('🗄️ Initializing SQLite database at:', dbPath);
    db = new Database(dbPath, { verbose: console.log });
    
    // Initialize database schema if needed
    initializeDatabase();
    
    // Seed test data for production/Railway
    if (process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production') {
        console.log('🚂 Railway deployment - seeding test data');
        seedTestData();
    }
    
} catch (error) {
    console.error('SQLite initialization failed:', error);
    throw error;
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

function seedTestData() {
    const bcrypt = require('bcryptjs');
    
    // Check if test users already exist
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get('test@example.com');
    if (existingUser) {
        console.log('👤 Test users already exist, skipping seed');
        return;
    }
    
    console.log('🌱 Seeding test data...');
    
    // Create test users with hashed passwords
    const testUsers = [
        { email: 'test@example.com', password: 'password123', role: 'Worker' },
        { email: 'lab@example.com', password: 'password123', role: 'Lab' },
        { email: 'provider@example.com', password: 'password123', role: 'Provider' }
    ];
    
    const insertUser = db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)');
    
    testUsers.forEach(user => {
        try {
            const hashedPassword = bcrypt.hashSync(user.password, 10);
            insertUser.run(user.email, hashedPassword, user.role);
            console.log(`✅ Created test user: ${user.email} (${user.role})`);
        } catch (error) {
            console.log(`⚠️ Test user ${user.email} already exists or error:`, error.message);
        }
    });
    
    console.log('🌱 Test data seeding completed');
}

module.exports = db;
