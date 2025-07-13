const fs = require('fs');
const path = require('path');
const db = require('../services/db.js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


async function columnExists(tableName, columnName) {
  const res = await db.query(`
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = $1 AND column_name = $2
  `, [tableName, columnName]);
  return res.rows.length > 0;
}

async function runMigrations() {
  const migrationsDir = __dirname;
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    if (file.endsWith('.sql')) {
      console.log(`--- Executing migration: ${file} ---`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      const statements = sql.split(';').filter(s => s.trim().length > 0);

      for (const statement of statements) {
        const trimmedStatement = statement.trim();
        try {
          // Specifically handle ALTER TABLE ADD COLUMN to make it idempotent
          if (trimmedStatement.toUpperCase().startsWith('ALTER TABLE')) {
            const match = trimmedStatement.match(/ALTER TABLE\s+([\w_]+)\s+ADD COLUMN\s+([\w_]+)/i);
            if (match) {
              const [, tableName, columnName] = match;
              if (await columnExists(tableName, columnName)) {
                console.log(`  - Column '${columnName}' on table '${tableName}' already exists. Skipping.`);
                continue;
              }
            }
          }
          await db.query(trimmedStatement);
          console.log(`  - SUCCESS: ${trimmedStatement.substring(0, 80)}...`);
        } catch (err) {
          // Gracefully handle "already exists" errors for tables
          if (err.code === '42P07') { // 42P07 is the code for duplicate_table
            console.log(`  - INFO: Table in statement already exists. Skipping.`);
          } else {
            console.error(`  - ERROR executing statement in ${file}:`, err.message);
            console.error('  - FAILED STATEMENT:', trimmedStatement);
            throw err; // Stop execution on other errors
          }
        }
      }
    }
  }
}

(async () => {
  try {
    await runMigrations();
    console.log('\nMigrations completed successfully.');
  } catch (err) {
    console.error('\nMigration script failed.');
  } finally {
    if (db.pool) {
      db.pool.end();
      console.log('Database connection closed.');
    }
  }
})();