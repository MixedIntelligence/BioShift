// Comprehensive, non-destructive seed script for PostgreSQL
require('dotenv').config();

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const getPoolConfig = () => {
  if (process.env.DATABASE_URL) {
    console.log('🐘 Production environment detected (DATABASE_URL is set). Using DATABASE_URL for seeding.');
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
            { email: 'admin@example.com', password: 'password', role: 'Admin' },
            { email: 'lab1@example.com', password: 'password', role: 'Lab' },
            { email: 'lab2@example.com', password: 'password', role: 'Lab' },
            { email: 'worker1@example.com', password: 'password', role: 'Worker' },
            { email: 'worker2@example.com', password: 'password', role: 'Worker' },
            { email: 'provider1@example.com', password: 'password', role: 'Provider' }
        ];
        
        for (const user of testUsers) {
            const hashedPassword = bcrypt.hashSync(user.password, 10);
            const insertQuery = {
                text: 'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING id',
                values: [user.email, hashedPassword, user.role],
            };
            const res = await client.query(insertQuery);
            if (res.rowCount > 0) {
                console.log(`✅ Created user: ${user.email} (${user.role})`);
                const userId = res.rows[0].id;
                await client.query('INSERT INTO user_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING', [userId]);
            } else {
                console.log(`⚠️ User already exists, skipping: ${user.email}`);
            }
        }

        // Get user IDs
        const adminRes = await client.query('SELECT id FROM users WHERE email = $1', ['admin@example.com']);
        const lab1Res = await client.query('SELECT id FROM users WHERE email = $1', ['lab1@example.com']);
        const lab2Res = await client.query('SELECT id FROM users WHERE email = $1', ['lab2@example.com']);
        const worker1Res = await client.query('SELECT id FROM users WHERE email = $1', ['worker1@example.com']);
        const worker2Res = await client.query('SELECT id FROM users WHERE email = $1', ['worker2@example.com']);
        const provider1Res = await client.query('SELECT id FROM users WHERE email = $1', ['provider1@example.com']);

        const adminId = adminRes.rows[0].id;
        const lab1Id = lab1Res.rows[0].id;
        const lab2Id = lab2Res.rows[0].id;
        const worker1Id = worker1Res.rows[0].id;
        const worker2Id = worker2Res.rows[0].id;
        const provider1Id = provider1Res.rows[0].id;

        // Seed Gigs
        console.log('🧪 Creating test gigs...');
        const gigs = [
            { title: 'CRISPR Gene Editing Specialist', description: 'Seeking an expert in CRISPR-Cas9 for a 3-month project.', user_id: lab1Id, location: 'Boston, MA' },
            { title: 'Mass Spectrometry Analyst', description: 'Experienced analyst needed for protein identification project.', user_id: lab2Id, location: 'San Francisco, CA' },
            { title: 'Bioinformatics Scientist', description: 'Develop and apply computational tools to analyze biological data.', user_id: lab1Id, location: 'New York, NY' },
            { title: 'Cell Culture Technician', description: 'Maintain and manage cell cultures for various experiments.', user_id: lab2Id, location: 'San Diego, CA' },
            { title: 'Protein Purification Scientist', description: 'Purify and characterize proteins for downstream applications.', user_id: lab1Id, location: 'Cambridge, MA' },
            { title: 'Flow Cytometry Specialist', description: 'Operate and maintain flow cytometry equipment.', user_id: lab2Id, location: 'Seattle, WA' },
            { title: 'Genomics Research Associate', description: 'Perform DNA/RNA sequencing and analysis.', user_id: lab1Id, location: 'Raleigh, NC' },
            { title: 'Immunology Research Scientist', description: 'Design and execute experiments to study the immune system.', user_id: lab2Id, location: 'Philadelphia, PA' },
            { title: 'Microscopy Core Facility Manager', description: 'Manage and maintain advanced microscopy equipment.', user_id: lab1Id, location: 'Chicago, IL' },
            { title: 'Quality Control Analyst', description: 'Perform quality control testing on biological products.', user_id: lab2Id, location: 'Houston, TX' },
            { title: 'Regulatory Affairs Specialist', description: 'Ensure compliance with regulatory requirements.', user_id: lab1Id, location: 'Washington, DC' },
            { title: 'Toxicology Study Director', description: 'Oversee toxicology studies for new drug candidates.', user_id: lab2Id, location: 'Denver, CO' },
            { title: 'Virology Research Assistant', description: 'Assist with research on viral diseases.', user_id: lab1Id, location: 'Atlanta, GA' },
            { title: 'Bioanalytical Scientist', description: 'Develop and validate bioanalytical methods.', user_id: lab2Id, location: 'Austin, TX' },
            { title: 'Clinical Research Coordinator', description: 'Coordinate clinical trials for new therapies.', user_id: lab1Id, location: 'Miami, FL' }
        ];

        for (const gig of gigs) {
            const gigExistsRes = await client.query('SELECT id FROM gigs WHERE title = $1 AND user_id = $2', [gig.title, gig.user_id]);
            if (gigExistsRes.rowCount === 0) {
                const insertGigQuery = {
                    text: 'INSERT INTO gigs (title, description, user_id, location) VALUES ($1, $2, $3, $4)',
                    values: [gig.title, gig.description, gig.user_id, gig.location],
                };
                await client.query(insertGigQuery);
                console.log(`✅ Created gig: ${gig.title}`);
            } else {
                console.log(`⚠️ Gig already exists, skipping: ${gig.title}`);
            }
        }
        
        // Get Gig IDs
        const gig1Res = await client.query('SELECT id FROM gigs WHERE title = $1', ['CRISPR Gene Editing Specialist']);
        const gig2Res = await client.query('SELECT id FROM gigs WHERE title = $1', ['Mass Spectrometry Analyst']);
        const gig1Id = gig1Res.rows[0].id;
        const gig2Id = gig2Res.rows[0].id;

        // Seed Applications
        console.log('📝 Creating test applications...');
        const applications = [
            { gig_id: gig1Id, user_id: worker1Id },
            { gig_id: gig1Id, user_id: worker2Id },
            { gig_id: gig2Id, user_id: worker1Id }
        ];

        for (const app of applications) {
            const appExistsRes = await client.query('SELECT id FROM applications WHERE gig_id = $1 AND user_id = $2', [app.gig_id, app.user_id]);
            if (appExistsRes.rowCount === 0) {
                const insertAppQuery = {
                    text: 'INSERT INTO applications (gig_id, user_id) VALUES ($1, $2)',
                    values: [app.gig_id, app.user_id],
                };
                await client.query(insertAppQuery);
                console.log(`✅ Created application for gig ${app.gig_id} from worker ${app.user_id}`);
            } else {
                console.log(`⚠️ Application already exists, skipping for gig ${app.gig_id} from worker ${app.user_id}`);
            }
        }

        // Seed Provider and Offerings
        console.log('🏢 Creating provider and offerings...');
        const providerExistsRes = await client.query('SELECT id FROM providers WHERE user_id = $1', [provider1Id]);
        let providerProfileId;
        if (providerExistsRes.rowCount === 0) {
            const insertProviderQuery = {
                text: 'INSERT INTO providers (user_id, company_name, website) VALUES ($1, $2, $3) RETURNING id',
                values: [provider1Id, 'BioTech Solutions', 'https://biotechsolutions.com'],
            };
            const providerRes = await client.query(insertProviderQuery);
            providerProfileId = providerRes.rows[0].id;
            console.log('✅ Created provider: BioTech Solutions');
        } else {
            providerProfileId = providerExistsRes.rows[0].id;
            console.log('⚠️ Provider already exists, skipping: BioTech Solutions');
        }

        const offerings = [
            { provider_id: providerProfileId, title: 'DNA Sequencing', subtitle: 'High-throughput sequencing services', description: '...', img: '...', offering_type: 'Service', category: 'Genomics', pricing_model: 'Per Sample', price: 100.00, rating: 4.5, url: '...' },
            { provider_id: providerProfileId, title: 'Confocal Microscope', subtitle: 'Access to high-resolution imaging', description: '...', img: '...', offering_type: 'Equipment', category: 'Microscopy', pricing_model: 'Per Hour', price: 50.00, rating: 4.8, url: '...' },
            { provider_id: providerProfileId, title: 'Bioinformatics Consulting', subtitle: 'Expert analysis of your biological data', description: '...', img: '...', offering_type: 'Service', category: 'Bioinformatics', pricing_model: 'Per Project', price: 5000.00, rating: 4.9, url: '...' },
            { provider_id: providerProfileId, title: 'Protein Expression and Purification', subtitle: 'High-yield protein production', description: '...', img: '...', offering_type: 'Service', category: 'Protein Science', pricing_model: 'Per Protein', price: 2500.00, rating: 4.7, url: '...' },
            { provider_id: providerProfileId, title: 'Flow Cytometer', subtitle: 'Cell sorting and analysis services', description: '...', img: '...', offering_type: 'Equipment', category: 'Cell Biology', pricing_model: 'Per Hour', price: 75.00, rating: 4.6, url: '...' },
            { provider_id: providerProfileId, title: 'Antibody Development', subtitle: 'Custom antibody production', description: '...', img: '...', offering_type: 'Service', category: 'Immunology', pricing_model: 'Per Project', price: 10000.00, rating: 4.9, url: '...' },
            { provider_id: providerProfileId, title: 'Mass Spectrometer', subtitle: 'Proteomics and metabolomics analysis', description: '...', img: '...', offering_type: 'Equipment', category: 'Analytical Chemistry', pricing_model: 'Per Sample', price: 200.00, rating: 4.8, url: '...' },
            { provider_id: providerProfileId, title: 'Cell Line Authentication', subtitle: 'Ensure the identity of your cell lines', description: '...', img: '...', offering_type: 'Service', category: 'Cell Biology', pricing_model: 'Per Sample', price: 150.00, rating: 4.9, url: '...' },
            { provider_id: providerProfileId, title: 'Histology Services', subtitle: 'Tissue processing and staining', description: '...', img: '...', offering_type: 'Service', category: 'Histology', pricing_model: 'Per Slide', price: 25.00, rating: 4.7, url: '...' },
            { provider_id: providerProfileId, title: 'PCR Machine', subtitle: 'Real-time and digital PCR systems', description: '...', img: '...', offering_type: 'Equipment', category: 'Molecular Biology', pricing_model: 'Per Day', price: 100.00, rating: 4.5, url: '...' },
            { provider_id: providerProfileId, title: 'Statistical Analysis', subtitle: 'Biostatistical consulting for your research', description: '...', img: '...', offering_type: 'Service', category: 'Bioinformatics', pricing_model: 'Per Hour', price: 150.00, rating: 4.9, url: '...' },
            { provider_id: providerProfileId, title: 'Grant Writing and Editing', subtitle: 'Expert assistance with grant proposals', description: '...', img: '...', offering_type: 'Service', category: 'Scientific Writing', pricing_model: 'Per Project', price: 3000.00, rating: 4.8, url: '...' },
            { provider_id: providerProfileId, title: 'Animal Models', subtitle: 'In vivo studies in various animal models', description: '...', img: '...', offering_type: 'Service', category: 'Preclinical Research', pricing_model: 'Per Study', price: 20000.00, rating: 4.7, url: '...' },
            { provider_id: providerProfileId, title: 'Next-Generation Sequencing (NGS)', subtitle: 'Comprehensive NGS services', description: '...', img: '...', offering_type: 'Service', category: 'Genomics', pricing_model: 'Per Run', price: 1500.00, rating: 4.8, url: '...' },
            { provider_id: providerProfileId, title: 'Laboratory Automation Consulting', subtitle: 'Optimize your lab workflows', description: '...', img: '...', offering_type: 'Service', category: 'Lab Management', pricing_model: 'Per Hour', price: 200.00, rating: 4.9, url: '...' }
        ];

        for (const offering of offerings) {
            const offeringExistsRes = await client.query('SELECT id FROM provider_offerings WHERE title = $1 AND provider_id = $2', [offering.title, offering.provider_id]);
            if (offeringExistsRes.rowCount === 0) {
                const insertOfferingQuery = {
                    text: 'INSERT INTO provider_offerings (provider_id, title, subtitle, description, img, offering_type, category, pricing_model, price, rating, url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
                    values: [offering.provider_id, offering.title, offering.subtitle, offering.description, offering.img, offering.offering_type, offering.category, offering.pricing_model, offering.price, offering.rating, offering.url],
                };
                await client.query(insertOfferingQuery);
                console.log(`✅ Created offering: ${offering.title}`);
            } else {
                console.log(`⚠️ Offering already exists, skipping: ${offering.title}`);
            }
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