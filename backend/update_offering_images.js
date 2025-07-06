const Database = require('better-sqlite3');
const path = require('path');

// Database setup
const dbPath = path.join(__dirname, 'biomvp.sqlite');
const db = new Database(dbPath);

// Available images in the LabLeapstock directory
const images = [
  'alex-santiago-CPv7g7CK-K0-unsplash.jpg',
  'alexandra-lawrence-y0IEI3PoTtg-unsplash (1).jpg',
  'alexandra-lawrence-y0IEI3PoTtg-unsplash.jpg',
  'andrei-r-popescu-FxeHBQqzI8g-unsplash.jpg',
  'brooke-balentine-wkyxzPcsJtU-unsplash.jpg',
  'cedric-letsch-60lxZce8eg4-unsplash.jpg',
  'dushawn-jovic-x4hkaBBTlBs-unsplash.jpg',
  'ingmar-bCRmt-hoANU-unsplash.jpg',
  'joel-timothy-ccQLzupEK10-unsplash (1).jpg',
  'joel-timothy-ccQLzupEK10-unsplash.jpg',
  'jonas-degener-BbRRJzYDGoM-unsplash.jpg',
  'joshua-earle-EUWYt3lszE4-unsplash.jpg',
  'kelly-sikkema-wl2qQ2JHMXA-unsplash.jpg',
  'lawrence-krowdeed-u0alw4egy0g-unsplash.jpg',
  'luca-severin-7huy4oOVHvs-unsplash.jpg',
  'marlon-medau-fhiPbVuni3s-unsplash (1).jpg',
  'marlon-medau-fhiPbVuni3s-unsplash.jpg',
  'nguyen-minh-8lMvKttWq2M-unsplash.jpg',
  'peter-thomas-AuVYd7aR5a4-unsplash.jpg',
  'red-zeppelin-mfP4VLsX3RA-unsplash.jpg',
  'roxy-aln-7mx6tJXn80s-unsplash.jpg',
  'sumup-bECO_rNpOns-unsplash (1).jpg',
  'sumup-Ch53fy0-ptA-unsplash.jpg',
  'sumup-yL8DBVfxSdE-unsplash.jpg',
  'tatiana-rudneva-aoMmHHCplJY-unsplash.jpg',
  'tatiana-rudneva-bX8g18DpIpI-unsplash.jpg',
  'tom-caillarec-eK1k5nLC8rw-unsplash.jpg',
  'tommao-wang-2DPIIHmfiIE-unsplash.jpg',
  'venti-views-Q_qNWPd2knY-unsplash.jpg'
];

try {
  console.log('Updating offering images...');
  
  // Get all offerings
  const offerings = db.prepare('SELECT id FROM provider_offerings ORDER BY id').all();
  
  // Update each offering with a local image
  const updateStmt = db.prepare('UPDATE provider_offerings SET img = ? WHERE id = ?');
  
  let updated = 0;
  offerings.forEach((offering, index) => {
    // Use modulo to cycle through images if we have more offerings than images
    const imageIndex = index % images.length;
    const imagePath = `/images/LabLeapstock/${images[imageIndex]}`;
    
    const result = updateStmt.run(imagePath, offering.id);
    if (result.changes > 0) {
      updated++;
    }
  });
  
  console.log(`Successfully updated ${updated} offerings with local images!`);
  
  // Verify the update
  const updatedOfferings = db.prepare('SELECT id, title, img FROM provider_offerings LIMIT 5').all();
  console.log('Sample updated offerings:');
  updatedOfferings.forEach(offering => {
    console.log(`- ${offering.title}: ${offering.img}`);
  });
  
} catch (error) {
  console.error('Error updating images:', error);
} finally {
  db.close();
}
