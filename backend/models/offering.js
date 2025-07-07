const db = require('./db');

async function createOffering(offeringData) {
  const { provider_id, title, subtitle, description, img, offering_type, category, pricing_model, price, rating, url } = offeringData;
  const query = `
    INSERT INTO provider_offerings (provider_id, title, subtitle, description, img, offering_type, category, pricing_model, price, rating, url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `;
  const params = [provider_id, title, subtitle, description, img, offering_type, category, pricing_model, price, rating, url];
  const result = await db.query(query, params);
  return result.rows[0];
}

async function listOfferings() {
  const result = await db.query('SELECT * FROM provider_offerings');
  return result.rows;
}

async function getOfferingById(id) {
  const result = await db.query('SELECT * FROM provider_offerings WHERE id = $1', [id]);
  return result.rows[0];
}

async function updateOffering(id, offeringData) {
  const { title, subtitle, description, img, offering_type, category, pricing_model, price, rating, url } = offeringData;
  const query = `
    UPDATE provider_offerings
    SET title = $1, subtitle = $2, description = $3, img = $4, offering_type = $5, category = $6, pricing_model = $7, price = $8, rating = $9, url = $10
    WHERE id = $11
    RETURNING *;
  `;
  const params = [title, subtitle, description, img, offering_type, category, pricing_model, price, rating, url, id];
  const result = await db.query(query, params);
  return result.rowCount > 0;
}

async function deleteOffering(id) {
  const result = await db.query('DELETE FROM provider_offerings WHERE id = $1', [id]);
  return result.rowCount > 0;
}

async function listOfferingsByProvider(provider_id) {
  const result = await db.query('SELECT * FROM provider_offerings WHERE provider_id = $1', [provider_id]);
  return result.rows;
}

module.exports = {
  createOffering,
  listOfferings,
  getOfferingById,
  updateOffering,
  deleteOffering,
  listOfferingsByProvider,
};