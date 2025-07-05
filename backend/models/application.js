const db = require('./db');

function getApplicationById(id) {
  const stmt = db.prepare('SELECT * FROM applications WHERE id = ?');
  return stmt.get(id);
}

function updateApplicationStatus(id, status) {
  const stmt = db.prepare('UPDATE applications SET status = ?, accepted_at = ? WHERE id = ?');
  const info = stmt.run(status, new Date().toISOString(), id);
  return info.changes > 0;
}

module.exports = {
  getApplicationById,
  updateApplicationStatus,
};