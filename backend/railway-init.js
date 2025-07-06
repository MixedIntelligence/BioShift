#!/usr/bin/env node

// Railway deployment initialization script
// This script sets up the database and seeds test data for Railway deployment

const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

async function initializeRailwayDeployment() {
    console.log('🚂 Initializing Railway deployment...');
    
    try {
        // 1. Initialize database
        console.log('📋 Setting up database...');
        const Database = require('better-sqlite3');
        const dbPath = path.resolve(__dirname, 'biomvp.sqlite');
        
        // Create database if it doesn't exist
        const db = new Database(dbPath);
        
        // Create tables
        console.log('🏗️ Creating database tables...');
        
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'Worker',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Gigs table should already exist with proper schema
        db.exec(`
            CREATE TABLE IF NOT EXISTS gigs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                user_id INTEGER NOT NULL,
                location TEXT,
                status TEXT DEFAULT 'open',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                required_skills TEXT,
                required_certifications TEXT,
                duration TEXT,
                pay_rate TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);
        
        db.exec(`
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                gig_id INTEGER NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (gig_id) REFERENCES gigs(id)
            );
        `);
        
        // 2. Seed test users
        console.log('🌱 Seeding test users...');
        
        const testUsers = [
            { email: 'test@example.com', password: 'password123', role: 'Worker' },
            { email: 'lab@example.com', password: 'password123', role: 'Lab' },
            { email: 'provider@example.com', password: 'password123', role: 'Provider' },
            { email: 'admin@bioshift.com', password: 'password123', role: 'Admin' }
        ];
        
        const insertUser = db.prepare('INSERT OR IGNORE INTO users (email, password_hash, role) VALUES (?, ?, ?)');
        
        for (const user of testUsers) {
            const hashedPassword = bcrypt.hashSync(user.password, 10);
            const result = insertUser.run(user.email, hashedPassword, user.role);
            
            if (result.changes > 0) {
                console.log(`✅ Created user: ${user.email} (${user.role})`);
            } else {
                console.log(`⚠️ User already exists: ${user.email}`);
            }
        }
        
        // 3. Create test gigs
        console.log('🧪 Creating test gigs...');
        
        const labUser = db.prepare('SELECT * FROM users WHERE email = ?').get('lab@example.com');
        if (labUser) {
            const testGigs = [
                {
                    title: 'Research Technician',
                    description: 'Seeking experienced research technician for molecular biology project',
                    location: 'San Francisco, CA',
                    user_id: labUser.id
                },
                {
                    title: 'Lab Assistant',
                    description: 'Entry-level position for laboratory assistance',
                    location: 'Boston, MA',
                    user_id: labUser.id
                }
            ];
            
            const insertGig = db.prepare('INSERT OR IGNORE INTO gigs (title, description, location, user_id) VALUES (?, ?, ?, ?)');
            
            for (const gig of testGigs) {
                const result = insertGig.run(gig.title, gig.description, gig.location, gig.user_id);
                if (result.changes > 0) {
                    console.log(`✅ Created gig: ${gig.title}`);
                }
            }
        }
        
        // 4. Verify setup
        console.log('\n📊 Verifying database setup...');
        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
        const gigCount = db.prepare('SELECT COUNT(*) as count FROM gigs').get().count;
        
        console.log(`👥 Users created: ${userCount}`);
        console.log(`💼 Gigs created: ${gigCount}`);
        
        db.close();
        
        console.log('\n🎉 Railway deployment initialization complete!');
        console.log('✅ Database is ready for production use');
        console.log('\n🔑 Test Login Credentials:');
        console.log('   Email: test@example.com');
        console.log('   Password: password123');
        console.log('   Role: Worker');
        console.log('\n   Email: lab@example.com');
        console.log('   Password: password123');
        console.log('   Role: Lab');
        
    } catch (error) {
        console.error('❌ Railway initialization failed:', error);
        throw error;
    }
}

// Run initialization if called directly
if (require.main === module) {
    initializeRailwayDeployment().catch(console.error);
}

module.exports = { initializeRailwayDeployment };
