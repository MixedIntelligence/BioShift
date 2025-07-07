const db = require('./db');

const findUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const createUser = async (email, passwordHash, role) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    console.log(`[DB_DEBUG] Attempting to create user: ${email}`);
    const userQuery = 'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id';
    const userResult = await client.query(userQuery, [email, passwordHash, role]);
    console.log('[DB_DEBUG] User insert result:', JSON.stringify(userResult.rows[0], null, 2));

    const newUserId = userResult.rows[0]?.id;

    if (!newUserId) {
      throw new Error('User creation failed, no ID returned.');
    }

    // Create a corresponding user_profiles entry
    const profileQuery = 'INSERT INTO user_profiles (user_id) VALUES ($1)';
    await client.query(profileQuery, [newUserId]);
    console.log(`[DB_DEBUG] Created empty profile for new user: ${newUserId}`);

    await client.query('COMMIT');
    
    return findUserById(newUserId);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[DB_DEBUG] Deep error creating user:', err);
    console.error('[DB_DEBUG] Error Name:', err.name);
    console.error('[DB_DEBUG] Error Message:', err.message);
    console.error('[DB_DEBUG] Error Stack:', err.stack);
    throw err;
  } finally {
    client.release();
  }
};

const addUserSkill = async (userId, skill) => {
  const stmt = 'INSERT INTO user_skills (user_id, skill) VALUES ($1, $2)';
  await db.query(stmt, [userId, skill]);
};

const addUserEducation = async (userId, education) => {
  const { institution, degree, field_of_study, start_year, end_year } = education;
  const stmt = 'INSERT INTO user_education (user_id, institution, degree, field_of_study, start_year, end_year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
  const result = await db.query(stmt, [userId, institution, degree, field_of_study, start_year, end_year]);
  return { id: result.rows[0].id, user_id: userId, ...education };
};

const addUserPublication = async (userId, publication) => {
  const { title, journal, year, url } = publication;
  const stmt = 'INSERT INTO user_publications (user_id, title, journal, year, url) VALUES ($1, $2, $3, $4, $5)';
  await db.query(stmt, [userId, title, journal, year, url]);
};

const getUserSkills = async (userId) => {
  const result = await db.query('SELECT * FROM user_skills WHERE user_id = $1', [userId]);
  return result.rows;
};

const getUserEducation = async (userId) => {
  const result = await db.query('SELECT * FROM user_education WHERE user_id = $1', [userId]);
  return result.rows;
};

const getUserPublications = async (userId) => {
  const result = await db.query('SELECT * FROM user_publications WHERE user_id = $1', [userId]);
  return result.rows;
};

const getUserDocuments = async (userId) => {
  const result = await db.query('SELECT * FROM user_documents WHERE user_id = $1', [userId]);
  return result.rows;
};

const addUserDocument = async (userId, filename, path) => {
  const stmt = 'INSERT INTO user_documents (user_id, filename, file_path) VALUES ($1, $2, $3) RETURNING id';
  const result = await db.query(stmt, [userId, filename, path]);
  return { id: result.rows[0].id, filename, file_path: path };
};

const getUserUpskill = async (userId) => {
  const result = await db.query('SELECT * FROM user_skills WHERE user_id = $1', [userId]);
  return result.rows;
};

const addUserUpskill = async (userId, upskill) => {
  try {
    const stmt = 'INSERT INTO user_skills (user_id, skill) VALUES ($1, $2)';
    await db.query(stmt, [userId, upskill]);
    return true;
  } catch (err) {
    console.error('Error adding upskill:', err);
    return false;
  }
};

const getUserPayments = async (userId) => {
  const result = await db.query('SELECT * FROM user_payments WHERE user_id = $1', [userId]);
  return result.rows;
};

const updateUserPayments = async (userId, paymentInfo) => {
  try {
    const stmt = 'UPDATE user_payments SET payment_info = $1 WHERE user_id = $2';
    await db.query(stmt, [JSON.stringify(paymentInfo), userId]);
    return true;
  } catch (err) {
    console.error('Error updating payment info:', err);
    return false;
  }
};

const getUserHistory = async (userId) => {
  const result = await db.query('SELECT * FROM user_history WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
};

const getUserStartups = async (userId) => {
  const result = await db.query('SELECT * FROM user_startups WHERE user_id = $1', [userId]);
  return result.rows;
};

const addUserStartup = async (userId, startup) => {
  try {
    const stmt = 'INSERT INTO user_startups (user_id, startup_name) VALUES ($1, $2)';
    await db.query(stmt, [userId, startup]);
    return true;
  } catch (err) {
    console.error('Error adding startup:', err);
    return false;
  }
};

const changePassword = async (userId, newPassword) => {
  try {
    const stmt = 'UPDATE users SET password_hash = $1 WHERE id = $2';
    await db.query(stmt, [newPassword, userId]);
    return true;
  } catch (err) {
    console.error('Error changing password:', err);
    return false;
  }
};

const getApplicationStatus = async (userId, labId) => {
  const result = await db.query('SELECT status FROM applications WHERE user_id = $1 AND lab_id = $2', [userId, labId]);
  return result.rows.length > 0 ? result.rows[0].status : null;
};

const updateUserProfile = async (userId, profileData) => {
  const {
    first_name, last_name, phone, bio, location, years_experience,
    current_position, company_name, website, linkedin_url, github_url, avatar_url
  } = profileData;

  const stmt = `
    INSERT INTO user_profiles (
      user_id, first_name, last_name, phone, bio, location, years_experience,
      current_position, company_name, website, linkedin_url, github_url, avatar_url
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    ON CONFLICT (user_id) DO UPDATE SET
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      phone = EXCLUDED.phone,
      bio = EXCLUDED.bio,
      location = EXCLUDED.location,
      years_experience = EXCLUDED.years_experience,
      current_position = EXCLUDED.current_position,
      company_name = EXCLUDED.company_name,
      website = EXCLUDED.website,
      linkedin_url = EXCLUDED.linkedin_url,
      github_url = EXCLUDED.github_url,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const result = await db.query(stmt, [
    userId, first_name, last_name, phone, bio, location, years_experience,
    current_position, company_name, website, linkedin_url, github_url, avatar_url
  ]);
  return result.rows[0];
};

const markProfileCompleted = async (userId) => {
  const stmt = 'UPDATE user_profiles SET profile_completed = TRUE WHERE user_id = $1';
  return await db.query(stmt, [userId]);
};

const markOnboardingCompleted = async (userId) => {
  const stmt = 'UPDATE user_profiles SET onboarding_completed = TRUE WHERE user_id = $1';
  return await db.query(stmt, [userId]);
};

const getUserProfile = async (userId) => {
  const result = await db.query(`
    SELECT
      u.id,
      u.email,
      u.role,
      u.created_at,
      p.first_name,
      p.last_name,
      p.phone,
      p.bio,
      p.location,
      p.years_experience,
      p.current_position,
      p.company_name,
      p.website,
      p.linkedin_url,
      p.github_url,
      p.avatar_url,
      p.profile_completed,
      p.onboarding_completed
    FROM users u
    LEFT JOIN user_profiles p ON u.id = p.user_id
    WHERE u.id = $1
  `, [userId]);
  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  addUserSkill,
  addUserEducation,
  addUserPublication,
  getUserSkills,
  getUserEducation,
  getUserPublications,
  getUserDocuments,
  addUserDocument,
  getUserUpskill,
  addUserUpskill,
  getUserPayments,
  updateUserPayments,
  getUserHistory,
  getUserStartups,
  addUserStartup,
  changePassword,
  getApplicationStatus,
  updateUserProfile,
  markProfileCompleted,
  markOnboardingCompleted,
  getUserProfile,
};
