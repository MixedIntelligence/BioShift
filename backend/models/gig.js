// Gig/Project model
const db = require('./db');

async function createGig({ title, description, userId, location, status = 'open', requiredSkills, requiredCertifications, duration, payRate }) {
  const query = `
    INSERT INTO gigs (title, description, user_id, location, status, required_skills, required_certifications, duration, pay_rate)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  const params = [title, description, userId, location, status, requiredSkills, requiredCertifications, duration, payRate];
  const result = await db.query(query, params);
  return result.rows[0];
}

async function listGigs() {
  const result = await db.query('SELECT * FROM gigs ORDER BY created_at DESC');
  return result.rows;
}

async function getGigById(id) {
  const result = await db.query('SELECT * FROM gigs WHERE id = $1', [id]);
  return result.rows[0];
}

async function updateGig(id, user, { title, description, status, location, requiredSkills, requiredCertifications, duration, payRate }) {
  const gig = await getGigById(id);
  if (!gig) return false;
  if (user.role !== 'Admin' && gig.user_id !== user.id) return false;

  const fields = [];
  const params = [];
  let paramIndex = 1;

  if (title) {
    fields.push(`title = $${paramIndex++}`);
    params.push(title);
  }
  if (description) {
    fields.push(`description = $${paramIndex++}`);
    params.push(description);
  }
  if (status) {
    fields.push(`status = $${paramIndex++}`);
    params.push(status);
  }
  if (location) {
    fields.push(`location = $${paramIndex++}`);
    params.push(location);
  }
  if (requiredSkills !== undefined) {
    fields.push(`required_skills = $${paramIndex++}`);
    params.push(requiredSkills);
  }
  if (requiredCertifications !== undefined) {
    fields.push(`required_certifications = $${paramIndex++}`);
    params.push(requiredCertifications);
  }
  if (duration !== undefined) {
    fields.push(`duration = $${paramIndex++}`);
    params.push(duration);
  }
  if (payRate !== undefined) {
    fields.push(`pay_rate = $${paramIndex++}`);
    params.push(payRate);
  }

  if (fields.length === 0) {
    return false;
  }

  params.push(id);
  const query = `UPDATE gigs SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *;`;
  const result = await db.query(query, params);
  return result.rowCount > 0;
}

async function deleteGig(id, user) {
  const gig = await getGigById(id);
  if (!gig) return false;
  if (user.role !== 'Admin' && gig.user_id !== user.id) return false;
  const result = await db.query('DELETE FROM gigs WHERE id = $1', [id]);
  return result.rowCount > 0;
}

// Application tracking
async function listApplications(gigId) {
  const query = `
    SELECT
      a.id, a.status, a.applied_at, a.accepted_at,
      u.id as user_id, p.first_name, p.last_name, u.email, p.bio, p.phone, p.location, p.years_experience, p.current_position,
      (p.first_name || ' ' || p.last_name) as name,
      p.avatar_url as avatar,
      '5.0' as rating, -- Placeholder
      'React, Node.js, Python' as skills, -- Placeholder
      'AWS Certified, Google Cloud' as certifications -- Placeholder
    FROM applications a
    JOIN users u ON a.user_id = u.id
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE a.gig_id = $1
    ORDER BY a.applied_at DESC
  `;
  const result = await db.query(query, [gigId]);
  return result.rows;
}

async function applyToGig(gigId, userId) {
  const check = await db.query('SELECT 1 FROM applications WHERE gig_id = $1 AND user_id = $2', [gigId, userId]);
  if (check.rows.length > 0) return false;
  const result = await db.query('INSERT INTO applications (gig_id, user_id) VALUES ($1, $2)', [gigId, userId]);
  return result.rowCount > 0;
}

async function searchGigs(query) {
  const searchQuery = 'SELECT * FROM gigs WHERE title ILIKE $1 OR description ILIKE $1 OR location ILIKE $1 ORDER BY created_at DESC';
  const result = await db.query(searchQuery, [`%${query}%`]);
  return result.rows;
}

async function listUserApplications(userId) {
  const query = `
    SELECT
      a.id as application_id, a.status, a.applied_at, a.accepted_at,
      g.id as gig_id, g.title, g.description, g.location, g.pay_rate, g.duration, g.status as gig_status, g.created_at as gig_created,
      lab_user.email as lab_email,
      lab_profile.first_name as lab_first_name,
      lab_profile.last_name as lab_last_name,
      (lab_profile.first_name || ' ' || lab_profile.last_name) as lab_name
    FROM applications a
    JOIN gigs g ON a.gig_id = g.id
    JOIN users lab_user ON g.user_id = lab_user.id
    LEFT JOIN user_profiles lab_profile ON lab_user.id = lab_profile.user_id
    WHERE a.user_id = $1
    ORDER BY a.applied_at DESC
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
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
