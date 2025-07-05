const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbFilePath = path.resolve(__dirname, '..', 'biomvp.sqlite');

// 1. Delete the old database file if it exists
if (fs.existsSync(dbFilePath)) {
    try {
        fs.unlinkSync(dbFilePath);
        console.log('Old database file deleted successfully.');
    } catch (err) {
        console.error('Error deleting database file:', err);
        process.exit(1); // Exit if we cannot delete the file
    }
}

// 2. Now, create a new database connection. This will create a new empty file.
const db = new Database(dbFilePath, { verbose: console.log });

// 3. Run the migrations
try {
    // Enable foreign key support
    db.pragma('foreign_keys = ON');

    const migrationFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    for (const file of migrationFiles) {
      const migration = fs.readFileSync(path.resolve(__dirname, file), 'utf8');
      db.exec(migration);
      console.log(`Executed migration: ${file}`);
    }

    console.log('Migrations executed successfully.');
} catch (err) {
    console.error('Error running migrations:', err);
} finally {
    db.close();
    console.log('Database connection closed.');
}