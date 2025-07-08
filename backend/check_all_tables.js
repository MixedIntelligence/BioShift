// PostgreSQL version of check_all_tables.js
// Connects to the database using pg and DATABASE_URL
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function checkAllTables() {
  try {
    const tablesResult = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log('Tables in the database:');
    for (const table of tables) {
      console.log(`- ${table}`);
      try {
        const rowCountResult = await pool.query(`SELECT count(*) as count FROM "${table}"`);
        const rowCount = rowCountResult.rows[0].count;
        console.log(`  - Row count: ${rowCount}`);
        if (rowCount > 0) {
          const rowsResult = await pool.query(`SELECT * FROM "${table}" LIMIT 5`);
          console.log(`  - Sample data:`);
          rowsResult.rows.forEach(row => console.log(`    - ${JSON.stringify(row)}`));
        }
      } catch (err) {
        console.error(`    - Error querying table ${table}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Error checking tables:', err.message);
  } finally {
    await pool.end();
  }
}

checkAllTables();