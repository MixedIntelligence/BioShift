const Database = require('better-sqlite3');
const db = new Database('./biomvp.sqlite');

try {
  const rows = db.prepare('SELECT id, email, role FROM users').all();
  console.log('Existing users:');
  rows.forEach(row => {
    console.log(`ID: ${row.id}, Email: ${row.email}, Role: ${row.role}`);
  });
} catch (err) {
  console.error('Error:', err);
} finally {
  db.close();
}
