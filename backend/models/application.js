const db = require('./db');

async function getApplicationById(id) {
  const result = await db.query('SELECT * FROM applications WHERE id = $1', [id]);
  return result.rows[0];
}

async function updateApplicationStatus(id, status) {
  const query = 'UPDATE applications SET status = $1, accepted_at = $2 WHERE id = $3';
  const params = [status, new Date().toISOString(), id];
  const result = await db.query(query, params);
  return result.rowCount > 0;
}

module.exports = {
  getApplicationById,
  updateApplicationStatus,
};