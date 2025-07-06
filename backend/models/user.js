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
  try {
    console.log(`[DB_DEBUG] Attempting to create user: ${email}`);
    const query = 'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id';
    const result = await db.query(query, [email, passwordHash, role]);
    console.log('[DB_DEBUG] User insert result:', JSON.stringify(result.rows[0], null, 2));

    const newUserId = result.rows[0]?.id;

    if (!newUserId) {
      console.error('[DB_DEBUG] CRITICAL: Insert operation did not return a valid ID.');
      // Attempt to find user by email as a fallback
      const user = await findUserByEmail(email);
      if (!user) {
        throw new Error('User was not created and could not be found.');
      }
      return user;
    }

    return findUserById(newUserId);
  } catch (err) {
    console.error('[DB_DEBUG] Deep error creating user:', err);
    console.error('[DB_DEBUG] Error Name:', err.name);
    console.error('[DB_DEBUG] Error Message:', err.message);
    console.error('[DB_DEBUG] Error Stack:', err.stack);
    throw err;
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
    current_position, company_name, website, linkedin_url, github_url
  } = profileData;

  const stmt = `
    UPDATE users SET
      first_name = $1, last_name = $2, phone = $3, bio = $4, location = $5,
      years_experience = $6, current_position = $7, company_name = $8,
      website = $9, linkedin_url = $10, github_url = $11
    WHERE id = $12
  `;

  return await db.query(stmt, [
    first_name, last_name, phone, bio, location, years_experience,
    current_position, company_name, website, linkedin_url, github_url, userId
  ]);
};

const markProfileCompleted = async (userId) => {
  const stmt = 'UPDATE users SET profile_completed = 1 WHERE id = $1';
  return await db.query(stmt, [userId]);
};

const markOnboardingCompleted = async (userId) => {
  const stmt = 'UPDATE users SET onboarding_completed = 1 WHERE id = $1';
  return await db.query(stmt, [userId]);
};

const getUserProfile = async (userId) => {
  const result = await db.query(`
    SELECT id, email, role, first_name, last_name, phone, bio, location,
           years_experience, current_position, company_name, website,
           linkedin_url, github_url, profile_completed, onboarding_completed,
           created_at
    FROM users WHERE id = $1
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
  updateUserProfile,
  markProfileCompleted,
  markOnboardingCompleted,
  getUserProfile,
};
