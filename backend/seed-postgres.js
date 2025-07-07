// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const getPoolConfig = () => {
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    console.log('🐘 Production environment detected. Using DATABASE_URL for seeding.');
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    };
  }
  console.log('🐘 Development environment detected. Using individual PG variables for seeding.');
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

seedDatabase().catch(console.error);