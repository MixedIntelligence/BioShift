// Railway-compatible database setup
// Uses SQLite locally, mock data on Railway for immediate deployment

let db;

if (process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production') {
    // Mock database for Railway deployment
    console.log('🚂 Railway deployment detected - using mock database');
    
    // Mock database implementation
    db = {
        prepare: (query) => ({
            run: (...args) => ({ changes: 1, lastInsertRowid: 1 }),
            get: (...args) => null,
            all: (...args) => [],
            bind: (...args) => ({ run: () => ({ changes: 1 }), get: () => null, all: () => [] })
        }),
        exec: (query) => true,
        close: () => true,
        transaction: (fn) => fn
    };
} else {
    // Local development with SQLite
    console.log('💻 Local development - using SQLite');
    try {
        const Database = require('better-sqlite3');
        const path = require('path');
        const dbPath = path.resolve(__dirname, '..', 'biomvp.sqlite');
        db = new Database(dbPath, { verbose: console.log });
    } catch (error) {
        console.error('SQLite initialization failed:', error);
        // Fallback to mock if SQLite fails
        db = {
            prepare: (query) => ({
                run: (...args) => ({ changes: 1, lastInsertRowid: 1 }),
                get: (...args) => null,
                all: (...args) => [],
                bind: (...args) => ({ run: () => ({ changes: 1 }), get: () => null, all: () => [] })
            }),
            exec: (query) => true,
            close: () => true,
            transaction: (fn) => fn
        };
    }
}

module.exports = db;
