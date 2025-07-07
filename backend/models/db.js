// PostgreSQL-only database setup
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Pool } = require('pg');

console.log('🐘 Using PostgreSQL for all environments.');

if (!process.env.DATABASE_URL) {
  throw new Error('FATAL: DATABASE_URL is not set. Please configure your .env file.');
}

const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
};

const db = new Pool(poolConfig);

// Test the connection
db.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error connecting to PostgreSQL:', err);
    } else {
        console.log('✅ Connected to PostgreSQL successfully at:', res.rows[0].now);
    }
});

module.exports = db;
