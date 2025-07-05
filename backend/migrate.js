const fs = require('fs');
const path = require('path');
const db = require('./models/db');

function migrate() {
  console.log('Running master migration...');
  const migrationPath = path.join(__dirname, 'models', '000_master_migration.sql');
  const migrationScript = fs.readFileSync(migrationPath, 'utf-8');
  
  try {
    db.exec(migrationScript);
    console.log('Master migration applied successfully.');
  } catch (err) {
    console.error('Error applying master migration:', err);
    throw err;
  }
}

migrate();
