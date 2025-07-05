-- Master Migration File for LabLeap v9 (SQLite Compatible)

-- Drop tables in reverse order of creation to handle dependencies
DROP TABLE IF EXISTS bank_accounts;
DROP TABLE IF EXISTS user_documents;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS user_education;
DROP TABLE IF EXISTS user_publications;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS bank_accounts;
DROP TABLE IF EXISTS bank_accounts;
DROP TABLE IF EXISTS provider_offerings;
DROP TABLE IF EXISTS providers;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS gigs;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create gigs table
CREATE TABLE gigs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    user_id INTEGER,
    location TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create applications table
CREATE TABLE applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gig_id INTEGER,
    user_id INTEGER,
    status TEXT DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    FOREIGN KEY (gig_id) REFERENCES gigs (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create user_skills table
CREATE TABLE user_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    skill TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create user_education table
CREATE TABLE user_education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT,
    start_year INTEGER,
    end_year INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create user_publications table
CREATE TABLE user_publications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    journal TEXT,
    year INTEGER,
    url TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create user_documents table
CREATE TABLE user_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create notifications table
CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create providers table
CREATE TABLE providers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    company_name TEXT,
    website TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create provider_offerings table
CREATE TABLE provider_offerings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    img TEXT,
    offering_type TEXT NOT NULL,
    category TEXT,
    pricing_model TEXT,
    price REAL,
    rating REAL,
    url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);
