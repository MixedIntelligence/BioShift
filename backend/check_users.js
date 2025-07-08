// PostgreSQL version of check_users.js
// Connects to the database using pg and DATABASE_URL
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function checkUsers() {
  try {
    console.log('=== EXISTING USERS ===');
    const usersResult = await pool.query('SELECT id, email, role FROM users');
    const rows = usersResult.rows;
    console.log('Existing users:');
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Email: ${row.email}, Role: ${row.role}`);
    });

    console.log('\n=== AVAILABLE TABLES ===');
    const tablesResult = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    const tables = tablesResult.rows;
    console.log('Available tables:');
    tables.forEach(table => {
      console.log('- ' + table.table_name);
    });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkUsers();
