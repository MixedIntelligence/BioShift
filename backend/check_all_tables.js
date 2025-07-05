const sqlite3 = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'biomvp.sqlite');
const db = new sqlite3(dbPath);

function checkAllTables() {
  try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables in the database:');
    tables.forEach(table => {
      console.log(`- ${table.name}`);
      try {
        const rowCount = db.prepare(`SELECT count(*) as count FROM ${table.name}`).get().count;
        console.log(`  - Row count: ${rowCount}`);
        if (rowCount > 0) {
          const rows = db.prepare(`SELECT * FROM ${table.name} LIMIT 5`).all();
          console.log(`  - Sample data:`);
          rows.forEach(row => console.log(`    - ${JSON.stringify(row)}`));
        }
      } catch (err) {
        console.error(`    - Error querying table ${table.name}:`, err.message);
      }
    });
  } catch (err) {
    console.error('Error checking tables:', err.message);
  } finally {
    db.close();
  }
}

checkAllTables();