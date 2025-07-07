#!/usr/bin/env node

// PostgreSQL initialization script
// This script sets up the database schema for a PostgreSQL database.

const { Pool } = require('pg');

const createTablesQueries = [
`
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Worker',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`,
`
CREATE TABLE IF NOT EXISTS user_skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    skill TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`,
`
CREATE TABLE IF NOT EXISTS user_education (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    start_year INTEGER,
    end_year INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`,
`
CREATE TABLE IF NOT EXISTS user_publications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    journal TEXT,
    year INTEGER,
    url TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`,
`
CREATE TABLE IF NOT EXISTS gigs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    user_id INTEGER NOT NULL,
    location TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    required_skills TEXT,
    required_certifications TEXT,
    duration TEXT,
    pay_rate TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`,
`
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    gig_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (gig_id) REFERENCES gigs(id) ON DELETE CASCADE
);
`
];

async function initializeDatabase() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ CRITICAL: DATABASE_URL environment variable is not set.');
        console.error('Please set DATABASE_URL to your PostgreSQL connection string.');
        process.exit(1);
    }

    console.log('🐘 Connecting to PostgreSQL database...');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully.');

    try {
        console.log('🏗️  Creating database tables...');
        for (const query of createTablesQueries) {
            await client.query(query);
        }
        console.log('✅ All tables created successfully or already exist.');

    } catch (error) {
        console.error('❌ Error initializing database schema:', error);
        process.exit(1);
    } finally {
        await client.release();
        await pool.end();
        console.log('🐘 Database connection closed.');
    }
}

// Run initialization if called directly
if (require.main === module) {
    initializeDatabase().catch(console.error);
}

module.exports = { initializeDatabase };