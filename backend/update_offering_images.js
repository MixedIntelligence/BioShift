// PostgreSQL version of update_offering_images.js
// Updates offering images in provider_offerings using pg and DATABASE_URL
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

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

async function updateOfferingImages() {
  try {
    console.log('Updating offering images...');
    // Get all offerings
    const offeringsResult = await pool.query('SELECT id, title FROM provider_offerings ORDER BY id');
    const offerings = offeringsResult.rows;
    let updated = 0;
    for (let index = 0; index < offerings.length; index++) {
      const offering = offerings[index];
      const imageIndex = index % images.length;
      const imagePath = `/images/LabLeapstock/${images[imageIndex]}`;
      const result = await pool.query('UPDATE provider_offerings SET img = $1 WHERE id = $2', [imagePath, offering.id]);
      if (result.rowCount > 0) {
        updated++;
      }
    }
    console.log(`Successfully updated ${updated} offerings with local images!`);
    // Verify the update
    const updatedOfferings = await pool.query('SELECT id, title, img FROM provider_offerings LIMIT 5');
    console.log('Sample updated offerings:');
    updatedOfferings.rows.forEach(offering => {
      console.log(`- ${offering.title}: ${offering.img}`);
    });
  } catch (error) {
    console.error('Error updating images:', error);
  } finally {
    await pool.end();
  }
}

updateOfferingImages();
