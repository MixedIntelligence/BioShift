const Database = require('better-sqlite3');
const db = new Database('./biomvp.sqlite');

try {
  console.log('=== EXISTING USERS ===');
  const rows = db.prepare('SELECT id, email, role FROM users').all();
  console.log('Existing users:');
  rows.forEach(row => {
    console.log(`ID: ${row.id}, Email: ${row.email}, Role: ${row.role}`);
  });

  console.log('\n=== AVAILABLE TABLES ===');
  const tables = db.prepare('SELECT name FROM sqlite_master WHERE type=\'table\'').all();
  console.log('Available tables:');
  tables.forEach(table => {
    console.log('- ' + table.name);
  });
} catch (err) {
  console.error('Error:', err);
} finally {
  db.close();
}
