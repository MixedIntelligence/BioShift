const Database = require('better-sqlite3');
const path = require('path');

// Correct the path to the database file
const dbPath = path.resolve(__dirname, '..', 'biomvp.sqlite');
const db = new Database(dbPath, { verbose: console.log });

module.exports = db;
