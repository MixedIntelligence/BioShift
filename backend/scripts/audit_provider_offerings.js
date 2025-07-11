// Audit provider_offerings table for missing or invalid IDs and provider links
// Usage: node audit_provider_offerings.js

const db = require('../models/db');

async function main() {
  try {
    // 1. Find all valid provider IDs
    const providersRes = await db.query('SELECT id FROM providers');
    const validProviderIds = new Set(providersRes.rows.map(r => r.id));

    // 2. Find all offerings
    const offeringsRes = await db.query('SELECT id, provider_id, title FROM provider_offerings');
    let issues = 0;
    for (const offering of offeringsRes.rows) {
      if (!offering.id || isNaN(offering.id) || offering.id <= 0) {
        console.log(`Invalid offering ID:`, offering);
        issues++;
      }
      if (!validProviderIds.has(offering.provider_id)) {
        console.log(`Offering with invalid provider_id:`, offering);
        issues++;
      }
    }
    if (issues === 0) {
      console.log('No issues found. All offerings have valid IDs and provider links.');
    } else {
      console.log(`Found ${issues} issues in provider_offerings table.`);
    }
  } catch (err) {
    console.error('Error auditing provider_offerings:', err);
  } finally {
    db.end && db.end();
  }
}

main();
