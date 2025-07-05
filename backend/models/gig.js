// Gig/Project model
const db = require('./db');

async function createGig({ title, description, userId, location }) {
  const stmt = db.prepare('INSERT INTO gigs (title, description, user_id, location) VALUES (?, ?, ?, ?)');
  const info = stmt.run(title, description, userId, location);
  return { id: info.lastInsertRowid, title, description, user_id: userId, location };
}

async function listGigs() {
  const stmt = db.prepare('SELECT * FROM gigs ORDER BY created_at DESC');
  return stmt.all();
}

async function getGigById(id) {
  const stmt = db.prepare('SELECT * FROM gigs WHERE id = ?');
  return stmt.get(id);
}

async function updateGig(id, user, { title, description, status, location }) {
  // Only allow update if Admin or gig owner (Lab)
  const gig = getGigById(id);
  if (!gig) return false;
  if (user.role !== 'Admin' && gig.user_id !== user.id) return false;

  const fields = [];
  const params = [];

  if (title) {
    fields.push('title = ?');
    params.push(title);
  }
  if (description) {
    fields.push('description = ?');
    params.push(description);
  }
  if (status) {
    fields.push('status = ?');
    params.push(status);
  }
  if (location) {
    fields.push('location = ?');
    params.push(location);
  }

  if (fields.length === 0) {
    return false; // No fields to update
  }

  params.push(id);

  const stmt = db.prepare(`UPDATE gigs SET ${fields.join(', ')} WHERE id = ?`);
  const info = stmt.run(...params);
  return info.changes > 0;
}

async function deleteGig(id, user) {
  // Only allow delete if Admin or gig owner (Lab)
  const gig = getGigById(id);
  if (!gig) return false;
  if (user.role !== 'Admin' && gig.user_id !== user.id) return false;
  const stmt = db.prepare('DELETE FROM gigs WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

// Application tracking
async function listApplications(gigId) {
  const stmt = db.prepare(`
    SELECT
      a.id,
      a.status,
      a.accepted_at,
      u.id as user_id,
      u.username,
      u.email
    FROM applications a
    JOIN users u ON a.user_id = u.id
    WHERE a.gig_id = ?
  `);
  return stmt.all(gigId);
}

async function applyToGig(gigId, userId) {
  // Prevent duplicate applications
  const check = db.prepare('SELECT 1 FROM applications WHERE gig_id = ? AND user_id = ?').get(gigId, userId);
  if (check) return false;
  const stmt = db.prepare('INSERT INTO applications (gig_id, user_id) VALUES (?, ?)');
  const info = stmt.run(gigId, userId);
  return info.changes > 0;
}

async function searchGigs(query) {
  const stmt = db.prepare('SELECT * FROM gigs WHERE title LIKE ? OR description LIKE ? OR location LIKE ? ORDER BY created_at DESC');
  return stmt.all(`%${query}%`, `%${query}%`, `%${query}%`);
}

module.exports = {
  createGig,
  listGigs,
  getGigById,
  updateGig,
  deleteGig,
  listApplications,
  applyToGig,
  searchGigs,
};
