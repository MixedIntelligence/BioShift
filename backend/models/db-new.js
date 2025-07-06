// Database abstraction layer - supports both SQLite (local) and PostgreSQL (Railway)
const path = require('path');

let db;

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  // Use PostgreSQL for Railway production
  const { Pool } = require('pg');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  // PostgreSQL wrapper to mimic SQLite interface
  db = {
    prepare: (sql) => ({
      run: async (...params) => {
        const client = await pool.connect();
        try {
          // Convert SQLite syntax to PostgreSQL
          const pgSql = sql
            .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/g, 'SERIAL PRIMARY KEY')
            .replace(/DATETIME DEFAULT CURRENT_TIMESTAMP/g, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
            .replace(/BOOLEAN DEFAULT 0/g, 'BOOLEAN DEFAULT FALSE')
            .replace(/BOOLEAN DEFAULT 1/g, 'BOOLEAN DEFAULT TRUE');
          
          const result = await client.query(pgSql, params);
          return { 
            lastInsertRowid: result.rows[0]?.id || null,
            changes: result.rowCount 
          };
        } finally {
          client.release();
        }
      },
      get: async (...params) => {
        const client = await pool.connect();
        try {
          const result = await client.query(sql, params);
          return result.rows[0] || null;
        } finally {
          client.release();
        }
      },
      all: async (...params) => {
        const client = await pool.connect();
        try {
          const result = await client.query(sql, params);
          return result.rows;
        } finally {
          client.release();
        }
      }
    }),
    exec: async (sql) => {
      const client = await pool.connect();
      try {
        await client.query(sql);
      } finally {
        client.release();
      }
    }
  };
} else {
  // Use SQLite for local development
  const Database = require('better-sqlite3');
  const dbPath = path.resolve(__dirname, '..', 'biomvp.sqlite');
  db = new Database(dbPath, { verbose: console.log });
}

module.exports = db;
