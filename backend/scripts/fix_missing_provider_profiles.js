// Script to audit and fix missing provider profiles for Provider users
// Usage: node fix_missing_provider_profiles.js

const db = require('../models/db');

async function main() {
  try {
    // 1. Find all users with role 'Provider'
    const usersRes = await db.query("SELECT id, email FROM users WHERE role = 'Provider'");
    const providerUsers = usersRes.rows;
    console.log(`Found ${providerUsers.length} users with role 'Provider'.`);

    // 2. Find all provider profiles
    const providersRes = await db.query('SELECT user_id FROM providers');
    const providerUserIds = new Set(providersRes.rows.map(r => r.user_id));

    let createdCount = 0;
    for (const user of providerUsers) {
      if (!providerUserIds.has(user.id)) {
        // Create provider profile for this user
        // You may want to customize companyName/website
        const companyName = user.email.split('@')[0] + "'s Lab";
        const website = '';
        await db.query(
          'INSERT INTO providers (user_id, company_name, website) VALUES ($1, $2, $3)',
          [user.id, companyName, website]
        );
        console.log(`Created provider profile for user ${user.email} (id: ${user.id})`);
        createdCount++;
      }
    }
    console.log(`Created ${createdCount} missing provider profiles.`);
    console.log('Done.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    db.end && db.end();
  }
}

main();
