// Migration to add additional fields to gigs table
const Database = require('better-sqlite3');
const db = new Database('biomvp.sqlite');

console.log('Adding additional fields to gigs table...');

try {
  // Add the new columns
  db.exec(`
    ALTER TABLE gigs ADD COLUMN required_skills TEXT;
    ALTER TABLE gigs ADD COLUMN required_certifications TEXT;
    ALTER TABLE gigs ADD COLUMN duration TEXT;
    ALTER TABLE gigs ADD COLUMN pay_rate TEXT;
  `);
  
  console.log('✅ Successfully added additional fields to gigs table:');
  console.log('   - required_skills');
  console.log('   - required_certifications');
  console.log('   - duration');
  console.log('   - pay_rate');
  
  // Verify the changes
  const tableInfo = db.prepare('PRAGMA table_info(gigs)').all();
  console.log('\n📋 Updated gigs table structure:');
  tableInfo.forEach(col => {
    console.log(`   ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''}`);
  });
  
} catch (error) {
  console.error('❌ Error updating gigs table:', error.message);
} finally {
  db.close();
}
