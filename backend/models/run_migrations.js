// PostgreSQL version of run_migrations.js
// Runs all .sql migration files in this directory using pg and DATABASE_URL
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runMigrations() {
  try {
    const migrationFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.sql'))
      .sort();
    for (const file of migrationFiles) {
      const migration = fs.readFileSync(path.resolve(__dirname, file), 'utf8');
      await pool.query(migration);
      console.log(`Executed migration: ${file}`);
    }
    console.log('Migrations executed successfully.');
  } catch (err) {
    console.error('Error running migrations:', err);
  } finally {
    await pool.end();
    console.log('Database connection closed.');
  }
}

runMigrations();