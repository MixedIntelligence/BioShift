require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

async function resetPassword() {
  console.log('🔑 Attempting to reset password in PostgreSQL...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ CRITICAL: DATABASE_URL environment variable is not set.');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  const newPassword = 'password123';
  const emailToUpdate = 'test@example.com';
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  console.log(`Hashed password for '${newPassword}': ${hashedPassword}`);

  const client = await pool.connect();
  try {
    const query = 'UPDATE users SET password_hash = $1 WHERE email = $2';
    const res = await client.query(query, [hashedPassword, emailToUpdate]);
    
    if (res.rowCount > 0) {
      console.log(`✅ Successfully updated password for ${emailToUpdate}.`);
    } else {
      console.log(`⚠️ User ${emailToUpdate} not found. No password was updated.`);
    }
  } catch (err) {
    console.error('❌ Error updating password in PostgreSQL:', err);
  } finally {
    await client.release();
    await pool.end();
    console.log('🐘 Database connection closed.');
  }
}

resetPassword();