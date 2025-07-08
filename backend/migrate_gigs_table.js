// PostgreSQL version of migrate_gigs_table.js
// Adds additional fields to the gigs table using pg and DATABASE_URL
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function migrateGigsTable() {
  console.log('Adding additional fields to gigs table...');
  try {
    // Add the new columns (if not already present)
    await pool.query(`ALTER TABLE gigs ADD COLUMN IF NOT EXISTS required_skills TEXT`);
    await pool.query(`ALTER TABLE gigs ADD COLUMN IF NOT EXISTS required_certifications TEXT`);
    await pool.query(`ALTER TABLE gigs ADD COLUMN IF NOT EXISTS duration TEXT`);
    await pool.query(`ALTER TABLE gigs ADD COLUMN IF NOT EXISTS pay_rate TEXT`);
    console.log('✅ Successfully added additional fields to gigs table:');
    console.log('   - required_skills');
    console.log('   - required_certifications');
    console.log('   - duration');
    console.log('   - pay_rate');

    // Verify the changes
    const tableInfo = await pool.query(`SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'gigs'`);
    console.log('\n📋 Updated gigs table structure:');
    tableInfo.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });
  } catch (error) {
    console.error('❌ Error updating gigs table:', error.message);
  } finally {
    await pool.end();
  }
}

migrateGigsTable();
