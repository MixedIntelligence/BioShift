// Gig/Project model
const db = require('./db');

async function createGig({ title, description, userId, location, status = 'open', requiredSkills, requiredCertifications, duration, payRate }) {
  const stmt = db.prepare(`
    INSERT INTO gigs (title, description, user_id, location, status, required_skills, required_certifications, duration, pay_rate) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(title, description, userId, location, status, requiredSkills, requiredCertifications, duration, payRate);
  return { 
    id: info.lastInsertRowid, 
    title, 
    description, 
    user_id: userId, 
    location, 
    status,
    required_skills: requiredSkills,
    required_certifications: requiredCertifications,
    duration,
    pay_rate: payRate
  };
}

async function listGigs() {
  const stmt = db.prepare('SELECT * FROM gigs ORDER BY created_at DESC');
  return stmt.all();
}

async function getGigById(id) {
  const stmt = db.prepare('SELECT * FROM gigs WHERE id = ?');
  return stmt.get(id);
}

async function updateGig(id, user, { title, description, status, location, requiredSkills, requiredCertifications, duration, payRate }) {
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
  if (requiredSkills !== undefined) {
    fields.push('required_skills = ?');
    params.push(requiredSkills);
  }
  if (requiredCertifications !== undefined) {
    fields.push('required_certifications = ?');
    params.push(requiredCertifications);
  }
  if (duration !== undefined) {
    fields.push('duration = ?');
    params.push(duration);
  }
  if (payRate !== undefined) {
    fields.push('pay_rate = ?');
    params.push(payRate);
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
      a.applied_at,
      a.accepted_at,
      u.id as user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.bio,
      u.phone,
      u.location,
      u.years_experience,
      u.current_position,
      (u.first_name || ' ' || u.last_name) as name,
      'https://via.placeholder.com/48' as avatar,
      '5.0' as rating,
      'React, Node.js, Python' as skills,
      'AWS Certified, Google Cloud' as certifications
    FROM applications a
    JOIN users u ON a.user_id = u.id
    WHERE a.gig_id = ?
    ORDER BY a.applied_at DESC
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

async function listUserApplications(userId) {
  const stmt = db.prepare(`
    SELECT 
      a.id as application_id,
      a.status,
      a.applied_at,
      a.accepted_at,
      g.id as gig_id,
      g.title,
      g.description,
      g.location,
      g.pay_rate,
      g.duration,
      g.status as gig_status,
      g.created_at as gig_created,
      u.email as lab_email,
      u.first_name as lab_first_name,
      u.last_name as lab_last_name,
      (u.first_name || ' ' || u.last_name) as lab_name
    FROM applications a
    JOIN gigs g ON a.gig_id = g.id
    JOIN users u ON g.user_id = u.id
    WHERE a.user_id = ?
    ORDER BY a.applied_at DESC
  `);
  return stmt.all(userId);
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
  listUserApplications,
};
