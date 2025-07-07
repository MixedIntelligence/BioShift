// Standard PostgreSQL database setup for Railway

const { Pool } = require('pg');

// Check for the DATABASE_URL environment variable.
if (!process.env.DATABASE_URL) {
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('!!! CRITICAL: DATABASE_URL NOT FOUND IN PRODUCTION !!!');
    console.error('!!! Please ensure the DATABASE_URL is set in your   !!!');
    console.error('!!! Railway service variables.                      !!!');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    process.exit(1); // Exit immediately if the database URL is not set.
}

console.log('🐘 Using PostgreSQL database');

// Create a new connection pool.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Use SSL in production, but not in local development if your local DB doesn't use it.
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Export the connection pool directly.
// The rest of the application can now use this pool to query the database.
module.exports = pool;
