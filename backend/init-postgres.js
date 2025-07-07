// This script is responsible for initializing the PostgreSQL database.
// It should be run before the main application server starts.

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { Pool } = require('pg');

const getPoolConfig = () => {
  // For production environments like Railway, use the standard DATABASE_URL.
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    console.log('🐘 Production environment detected. Using DATABASE_URL.');
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    };
  }

  // For local development, use individual variables from a .env file.
  console.log('🐘 Development environment detected. Using individual PG variables.');
  const requiredVars = ['PGHOST', 'PGUSER', 'PGPASSWORD', 'PGDATABASE', 'PGPORT'];
  const missingVars = requiredVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables for local development: ${missingVars.join(', ')}`);
  }

  return {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
  };
};

const connectWithRetry = async (pool, retries = 5, delay = 5000) => {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log('✅ Connected to PostgreSQL successfully for initialization.');
      return client;
    } catch (error) {
      lastError = error;
      console.warn(`🐘 Attempt ${i + 1} of ${retries} failed. Retrying in ${delay / 1000}s...`);
      console.warn(`   Error: ${error.message}`);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  console.error('❌ All attempts to connect to the database failed.');
  throw lastError;
};


const initializeDatabase = async () => {
    console.log('🐘 Attempting to connect to PostgreSQL database for initialization...');
    
    const poolConfig = getPoolConfig();
    const pool = new Pool(poolConfig);

    let client;
    try {
        client = await connectWithRetry(pool);
    } catch (error) {
        console.error('❌ Failed to connect to the database after multiple retries:', error);
        process.exit(1);
    }

    // The comprehensive list of all tables to be dropped for a clean migration.
    const dropTablesQueries = [
      'DROP TABLE IF EXISTS transactions CASCADE;',
      'DROP TABLE IF EXISTS agreements CASCADE;',
      'DROP TABLE IF EXISTS applications CASCADE;',
      'DROP TABLE IF EXISTS gigs CASCADE;',
      'DROP TABLE IF EXISTS provider_offerings CASCADE;',
      'DROP TABLE IF EXISTS provider_applications CASCADE;',
      'DROP TABLE IF EXISTS providers CASCADE;',
      'DROP TABLE IF EXISTS messages CASCADE;',
      'DROP TABLE IF EXISTS conversation_participants CASCADE;',
      'DROP TABLE IF EXISTS conversations CASCADE;',
      'DROP TABLE IF EXISTS notifications CASCADE;',
      'DROP TABLE IF EXISTS bank_accounts CASCADE;',
      'DROP TABLE IF EXISTS user_documents CASCADE;',
      'DROP TABLE IF EXISTS user_skills CASCADE;',
      'DROP TABLE IF EXISTS user_education CASCADE;',
      'DROP TABLE IF EXISTS user_publications CASCADE;',
      'DROP TABLE IF EXISTS user_payments CASCADE;',
      'DROP TABLE IF EXISTS user_history CASCADE;',
      'DROP TABLE IF EXISTS user_startups CASCADE;',
      'DROP TABLE IF EXISTS user_profiles CASCADE;',
      'DROP TABLE IF EXISTS users CASCADE;',
    ];

    const createTablesQueries = [
        `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'Worker',
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS user_profiles (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            first_name TEXT,
            last_name TEXT,
            phone TEXT,
            bio TEXT,
            location TEXT,
            years_experience INTEGER,
            current_position TEXT,
            company_name TEXT,
            website TEXT,
            linkedin_url TEXT,
            github_url TEXT,
            avatar_url TEXT,
            profile_completed BOOLEAN DEFAULT FALSE,
            onboarding_completed BOOLEAN DEFAULT FALSE,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS user_skills (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            skill TEXT NOT NULL
        );`,
        `CREATE TABLE IF NOT EXISTS user_education (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            institution TEXT NOT NULL,
            degree TEXT NOT NULL,
            field_of_study TEXT,
            start_year INTEGER,
            end_year INTEGER
        );`,
        `CREATE TABLE IF NOT EXISTS user_publications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            journal TEXT,
            year INTEGER,
            url TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS user_documents (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            filename TEXT NOT NULL,
            file_path TEXT NOT NULL,
            uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS gigs (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            location TEXT,
            status TEXT DEFAULT 'open',
            required_skills TEXT,
            required_certifications TEXT,
            duration TEXT,
            pay_rate TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS applications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            gig_id INTEGER NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
            status TEXT DEFAULT 'pending',
            applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            accepted_at TIMESTAMPTZ,
            UNIQUE(gig_id, user_id)
        );`,
        `CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS agreements (
            id SERIAL PRIMARY KEY,
            application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
            gig_id INTEGER NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
            lab_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            worker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            status VARCHAR(255) NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'active', 'completed', 'terminated')),
            terms TEXT,
            total_amount NUMERIC(10, 2) NOT NULL,
            commission_rate NUMERIC(3, 2) NOT NULL,
            commission_amount NUMERIC(10, 2) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            completed_at TIMESTAMPTZ
        );`,
        `CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            agreement_id INTEGER REFERENCES agreements(id) ON DELETE CASCADE,
            from_user_id INTEGER NOT NULL REFERENCES users(id),
            to_user_id INTEGER NOT NULL REFERENCES users(id),
            transaction_type VARCHAR(255) NOT NULL CHECK (transaction_type IN ('payment', 'payout', 'commission', 'refund')),
            amount NUMERIC(10, 2) NOT NULL,
            status VARCHAR(255) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
            payment_gateway_id VARCHAR(255),
            description TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );`,
        `CREATE TABLE IF NOT EXISTS bank_accounts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            account_holder_name TEXT,
            account_number TEXT,
            routing_number TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS conversations (
          id SERIAL PRIMARY KEY,
          subject TEXT,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS conversation_participants (
          conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          PRIMARY KEY (conversation_id, user_id)
        );`,
        `CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
          sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          body TEXT,
          sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          is_read BOOLEAN DEFAULT FALSE
        );`,
        `CREATE TABLE IF NOT EXISTS providers (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            company_name TEXT,
            website TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS provider_applications (
            id SERIAL PRIMARY KEY,
            provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
            name TEXT,
            description TEXT,
            api_key TEXT,
            client_secret TEXT,
            redirect_uri TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS provider_offerings (
            id SERIAL PRIMARY KEY,
            provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            subtitle TEXT,
            description TEXT,
            img TEXT,
            offering_type TEXT NOT NULL,
            category TEXT,
            pricing_model TEXT,
            price NUMERIC,
            rating NUMERIC,
            url TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS user_payments (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            payment_info TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS user_history (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            action TEXT NOT NULL,
            details TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`,
        `CREATE TABLE IF NOT EXISTS user_startups (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            startup_name TEXT NOT NULL,
            description TEXT,
            website TEXT,
            role TEXT,
            start_date DATE,
            end_date DATE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`
    ];

    try {
        console.log('💣 Dropping all existing tables for a clean slate...');
        for (const query of dropTablesQueries) {
            await client.query(query);
        }
        console.log('✅ All existing tables dropped successfully.');

        console.log('🏗️  Creating definitive database schema...');
        for (const query of createTablesQueries) {
            await client.query(query);
        }
        console.log('✅ All tables created successfully from definitive schema.');

    } catch (error) {
        console.error('❌ Error initializing definitive database schema:', error);
        process.exit(1);
    } finally {
        if (client) {
            await client.release();
        }
        await pool.end();
        console.log('🐘 Database initialization complete. Connection closed.');
    }
}

// Execute the initialization
initializeDatabase().catch(err => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
});