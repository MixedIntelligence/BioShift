console.log('--- START OF APPLICATION ---');
console.log(`NODE_ENV is: ${process.env.NODE_ENV}`);
console.log(`DATABASE_URL is: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);
console.log('--------------------------');
console.log('--- Environment Variables ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded' : 'MISSING OR UNDEFINED');
console.log('---------------------------');
if (process.env.NODE_ENV !== 'production') {
  console.log('Development environment: Loading .env file');
  require('dotenv').config();
}
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Example route for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running.', timestamp: new Date().toISOString() });
});


// Railway-specific mock data endpoints (only non-auth endpoints)
if (process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production') {
  console.log('🚂 Railway deployment - adding mock data endpoints');
  
  // Mock labs endpoint
  app.get('/api/labs', (req, res) => {
    res.json([
      { id: 1, name: 'BioTech Labs Inc.', location: 'San Francisco, CA', type: 'Research' },
      { id: 2, name: 'Genomics Research Center', location: 'Boston, MA', type: 'Genomics' }
    ]);
  });

  // Mock gigs endpoint  
  app.get('/api/gigs', (req, res) => {
    res.json([
      { id: 1, title: 'Research Technician', lab: 'BioTech Labs Inc.', status: 'Open' },
      { id: 2, title: 'Lab Assistant', lab: 'Genomics Research Center', status: 'Open' }
    ]);
  });

  // Mock users test endpoint
  app.get('/api/users/test', (req, res) => {
    res.json({ message: 'Users endpoint operational', count: 2 });
  });
}

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const gigsRoutes = require('./routes/gigs');
app.use('/api/gigs', gigsRoutes);

const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

const paymentsRoutes = require('./routes/payments');
app.use('/api/payments', paymentsRoutes);

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

const applicationsRoutes = require('./routes/applications');
app.use('/api/applications', applicationsRoutes);

const notificationsRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationsRoutes);

const connectRoutes = require('./routes/connect');
app.use('/api/connect', connectRoutes);

const offeringsRoutes = require('./routes/offerings');
app.use('/api/offerings', offeringsRoutes);

const bankAccountsRoutes = require('./routes/bank_accounts');
app.use('/api/bank_accounts', bankAccountsRoutes);

const agreementsRoutes = require('./routes/agreements');
app.use('/api/agreements', agreementsRoutes);

const transactionsRoutes = require('./routes/transactions');
app.use('/api/transactions', transactionsRoutes);

const verificationRoutes = require('./routes/verification');
app.use('/api', verificationRoutes);

const providerRoutes = require('./routes/providers');
app.use('/api/provider', providerRoutes);

const inboxRoutes = require('./routes/inbox');
app.use('/api/inbox', inboxRoutes);

// TODO: Add bionics and integration routes

const { Pool } = require('pg');

const initializeDatabase = async () => {
    if (!process.env.DATABASE_URL) {
        console.error('❌ CRITICAL: DATABASE_URL environment variable is not set.');
        process.exit(1);
    }

    console.log('🐘 Connecting to PostgreSQL database for initialization...');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully for initialization.');

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
        console.log('🐘 Database initialization connection closed.');
    }
}

if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  
  initializeDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }).catch(err => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
}

module.exports = app;
