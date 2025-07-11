const db = require('./db');

const providerModel = {
  async createProvider(userId, companyName, website) {
    const query = `
      INSERT INTO providers (user_id, company_name, website)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await db.query(query, [userId, companyName, website]);
    return result.rows[0];
  },

  async createApplication(appData) {
    const { provider_id, name, description, api_key, client_secret, redirect_uri } = appData;
    const query = `
      INSERT INTO provider_applications (provider_id, name, description, api_key, client_secret, redirect_uri)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const params = [provider_id, name, description, api_key, client_secret, redirect_uri];
    const result = await db.query(query, params);
    return result.rows[0];
  },

  async getApplicationsByProvider(providerId) {
    const result = await db.query('SELECT * FROM provider_applications WHERE provider_id = $1', [providerId]);
    return result.rows;
  },

  async getApplicationById(id) {
    const result = await db.query('SELECT * FROM provider_applications WHERE id = $1', [id]);
    return result.rows[0];
  },

  async updateApplication(id, appData) {
    const { name, description, redirect_uri } = appData;
    const query = `
      UPDATE provider_applications
      SET name = $1, description = $2, redirect_uri = $3
      WHERE id = $4
    `;
    const result = await db.query(query, [name, description, redirect_uri, id]);
    return result.rowCount > 0;
  },

  async deleteApplication(id) {
    const result = await db.query('DELETE FROM provider_applications WHERE id = $1', [id]);
    return result.rowCount > 0;
  },

  async findProviderByUserId(userId) {
    const result = await db.query('SELECT * FROM providers WHERE user_id = $1', [userId]);
    return result.rows[0];
  }
};

module.exports = providerModel;