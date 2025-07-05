const db = require('./db');

function createOffering(offeringData) {
  const { provider_id, title, subtitle, description, img, offering_type, category, pricing_model, price, rating, url } = offeringData;
  const stmt = db.prepare(
    'INSERT INTO provider_offerings (provider_id, title, subtitle, description, img, offering_type, category, pricing_model, price, rating, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const info = stmt.run(provider_id, title, subtitle, description, img, offering_type, category, pricing_model, price, rating, url);
  return { id: info.lastInsertRowid, ...offeringData };
}

function listOfferings() {
  const stmt = db.prepare('SELECT * FROM provider_offerings');
  return stmt.all();
}

function getOfferingById(id) {
  const stmt = db.prepare('SELECT * FROM provider_offerings WHERE id = ?');
  return stmt.get(id);
}

function updateOffering(id, offeringData) {
  const { title, subtitle, description, img, offering_type, category, pricing_model, price, rating, url } = offeringData;
  const stmt = db.prepare(
    'UPDATE provider_offerings SET title = ?, subtitle = ?, description = ?, img = ?, offering_type = ?, category = ?, pricing_model = ?, price = ?, rating = ?, url = ? WHERE id = ?'
  );
  const info = stmt.run(title, subtitle, description, img, offering_type, category, pricing_model, price, rating, url, id);
  return info.changes > 0;
}

function deleteOffering(id) {
  const stmt = db.prepare('DELETE FROM provider_offerings WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

function listOfferingsByProvider(provider_id) {
  const stmt = db.prepare('SELECT * FROM provider_offerings WHERE provider_id = ?');
  return stmt.all(provider_id);
}

module.exports = {
  createOffering,
  listOfferings,
  getOfferingById,
  updateOffering,
  deleteOffering,
  listOfferingsByProvider,
};