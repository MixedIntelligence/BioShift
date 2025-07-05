const db = require('./db');

const providerModel = {
  createProvider(userId, companyName, website) {
    const stmt = db.prepare(`
      INSERT INTO providers (user_id, company_name, website)
      VALUES (?, ?, ?)
    `);
    const info = stmt.run(userId, companyName, website);
    return { id: info.lastInsertRowid, user_id: userId, company_name: companyName, website };
  },

  createApplication(appData) {
    const { provider_id, name, description, api_key, client_secret, redirect_uri } = appData;
    const stmt = db.prepare(`
      INSERT INTO provider_applications (provider_id, name, description, api_key, client_secret, redirect_uri)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(provider_id, name, description, api_key, client_secret, redirect_uri);
    return { id: info.lastInsertRowid, ...appData };
  },

  getApplicationsByProvider(providerId) {
    const stmt = db.prepare('SELECT * FROM provider_applications WHERE provider_id = ?');
    return stmt.all(providerId);
  },

  getApplicationById(id) {
    const stmt = db.prepare('SELECT * FROM provider_applications WHERE id = ?');
    return stmt.get(id);
  },

  updateApplication(id, appData) {
    const { name, description, redirect_uri } = appData;
    const stmt = db.prepare(`
      UPDATE provider_applications
      SET name = ?, description = ?, redirect_uri = ?
      WHERE id = ?
    `);
    const info = stmt.run(name, description, redirect_uri, id);
    return info.changes > 0;
  },

  deleteApplication(id) {
    const stmt = db.prepare('DELETE FROM provider_applications WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
  }
};

module.exports = providerModel;