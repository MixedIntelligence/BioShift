// This script is responsible for initializing and seeding the PostgreSQL database.
// It should be run during the deployment process.

// Load environment variables from .env file
require('dotenv').config();

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

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

const seedDatabase = async () => {
    console.log('🌱 Starting to seed the PostgreSQL database...');
    
    const poolConfig = getPoolConfig();
    const pool = new Pool(poolConfig);
    const client = await pool.connect();

    try {
        // Seed test users
        console.log('🌱 Seeding test users...');
        
        const testUsers = [
            { email: 'test@example.com', password: 'password123', role: 'Worker' },
            { email: 'lab@example.com', password: 'password123', role: 'Lab' },
            { email: 'provider@example.com', password: 'password123', role: 'Provider' },
            { email: 'admin@bioshift.com', password: 'password123', role: 'Admin' }
        ];
        
        for (const user of testUsers) {
            const hashedPassword = bcrypt.hashSync(user.password, 10);
            // Use INSERT ... ON CONFLICT DO NOTHING to avoid errors on re-runs
            const insertQuery = {
                text: 'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
                values: [user.email, hashedPassword, user.role],
            };
            const res = await client.query(insertQuery);
            if (res.rowCount > 0) {
                console.log(`✅ Created user: ${user.email} (${user.role})`);
            } else {
                console.log(`⚠️ User already exists, skipping: ${user.email}`);
            }
        }

        // Seed test gigs
        console.log('🧪 Creating test gigs...');
        
        const labUserRes = await client.query('SELECT id FROM users WHERE email = $1', ['lab@example.com']);
        const labUser = labUserRes.rows[0];

        if (labUser) {
            const testGigs = [
                {
                    title: 'Research Technician',
                    description: 'Seeking experienced research technician for molecular biology project',
                    location: 'San Francisco, CA',
                    user_id: labUser.id
                },
                {
                    title: 'Lab Assistant',
                    description: 'Entry-level position for laboratory assistance',
                    location: 'Boston, MA',
                    user_id: labUser.id
                }
            ];
            
            for (const gig of testGigs) {
                // Check if gig exists before inserting
                const gigExistsRes = await client.query('SELECT id FROM gigs WHERE title = $1 AND user_id = $2', [gig.title, gig.user_id]);
                if (gigExistsRes.rowCount === 0) {
                    const insertGigQuery = {
                        text: 'INSERT INTO gigs (title, description, location, user_id) VALUES ($1, $2, $3, $4)',
                        values: [gig.title, gig.description, gig.location, gig.user_id],
                    };
                    await client.query(insertGigQuery);
                    console.log(`✅ Created gig: ${gig.title}`);
                } else {
                    console.log(`⚠️ Gig already exists, skipping: ${gig.title}`);
                }
            }
        } else {
            console.warn('⚠️ Lab user not found, skipping gig creation.');
        }

        console.log('\n🎉 Database seeding complete!');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await client.release();
        await pool.end();
    }
};

const setupDatabase = async () => {
  await initializeDatabase();
  await seedDatabase();
}

// Execute the initialization
setupDatabase().catch(err => {
    console.error("Failed to setup database:", err);
    process.exit(1);
});