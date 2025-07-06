const db = require('./models/db');

console.log('Migrating offerings from offerings table to provider_offerings table...');

try {
  // Get all offerings from the offerings table
  const offerings = db.prepare('SELECT * FROM offerings').all();
  console.log(`Found ${offerings.length} offerings to migrate`);

  // Prepare insert statement for provider_offerings
  const insertStmt = db.prepare(`
    INSERT INTO provider_offerings (
      provider_id, title, subtitle, description, img, offering_type, 
      category, pricing_model, price, rating, url, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let migrated = 0;
  
  for (const offering of offerings) {
    try {
      insertStmt.run(
        offering.user_id || 1,  // provider_id (use user_id from offerings, default to 1)
        offering.title,
        null,  // subtitle (not in original data)
        offering.description,
        offering.image,  // img (map from image field)
        offering.type,  // offering_type (map from type field)
        offering.category,
        'fixed',  // pricing_model (default to fixed)
        offering.price,
        null,  // rating (not in original data)
        null,  // url (not in original data)
        offering.created_at
      );
      migrated++;
      console.log(`Migrated: ${offering.title}`);
    } catch (error) {
      console.error(`Error migrating offering "${offering.title}":`, error.message);
    }
  }

  console.log(`Successfully migrated ${migrated} offerings!`);
  
  // Check how many offerings are now in provider_offerings
  const count = db.prepare('SELECT COUNT(*) as count FROM provider_offerings').get();
  console.log(`Total offerings in provider_offerings: ${count.count}`);

} catch (error) {
  console.error('Migration failed:', error);
}
