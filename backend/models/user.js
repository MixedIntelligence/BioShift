const db = require('./db');

const findUserByEmail = (email) => {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
};

const findUserById = (id) => {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
};

const createUser = (email, passwordHash, role) => {
  try {
    db.prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)')
      .run(email, passwordHash, role);
    return findUserByEmail(email);
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

const addUserSkill = (userId, skill) => {
  const stmt = db.prepare('INSERT INTO user_skills (user_id, skill) VALUES (?, ?)');
  stmt.run(userId, skill);
};

const addUserEducation = (userId, education) => {
  const { institution, degree, field_of_study, start_year, end_year } = education;
  const stmt = db.prepare('INSERT INTO user_education (user_id, institution, degree, field_of_study, start_year, end_year) VALUES (?, ?, ?, ?, ?, ?)');
  const result = stmt.run(userId, institution, degree, field_of_study, start_year, end_year);
  return { id: result.lastInsertRowid, user_id: userId, ...education };
};

const addUserPublication = (userId, publication) => {
  const { title, journal, year, url } = publication;
  const stmt = db.prepare('INSERT INTO user_publications (user_id, title, journal, year, url) VALUES (?, ?, ?, ?, ?)');
  stmt.run(userId, title, journal, year, url);
};

const getUserSkills = (userId) => {
  return db.prepare('SELECT * FROM user_skills WHERE user_id = ?').all(userId);
};

const getUserEducation = (userId) => {
  return db.prepare('SELECT * FROM user_education WHERE user_id = ?').all(userId);
};

const getUserPublications = (userId) => {
  return db.prepare('SELECT * FROM user_publications WHERE user_id = ?').all(userId);
};

const getUserDocuments = (userId) => {
  return db.prepare('SELECT * FROM user_documents WHERE user_id = ?').all(userId);
};

const addUserDocument = (userId, filename, path) => {
  const stmt = db.prepare('INSERT INTO user_documents (user_id, filename, file_path) VALUES (?, ?, ?)');
  const result = stmt.run(userId, filename, path);
  return { id: result.lastInsertRowid, filename, file_path: path };
};

const getUserUpskill = (userId) => {
  return db.prepare('SELECT * FROM user_skills WHERE user_id = ?').all(userId);
};

const addUserUpskill = (userId, upskill) => {
  try {
    const stmt = db.prepare('INSERT INTO user_skills (user_id, skill) VALUES (?, ?)');
    stmt.run(userId, upskill);
    return true;
  } catch (err) {
    console.error('Error adding upskill:', err);
    return false;
  }
};

const getUserPayments = (userId) => {
  return db.prepare('SELECT * FROM user_payments WHERE user_id = ?').all(userId);
};

const updateUserPayments = (userId, paymentInfo) => {
  try {
    const stmt = db.prepare('UPDATE user_payments SET payment_info = ? WHERE user_id = ?');
    stmt.run(JSON.stringify(paymentInfo), userId);
    return true;
  } catch (err) {
    console.error('Error updating payment info:', err);
    return false;
  }
};

const getUserHistory = (userId) => {
  return db.prepare('SELECT * FROM user_history WHERE user_id = ? ORDER BY created_at DESC').all(userId);
};

const getUserStartups = (userId) => {
  return db.prepare('SELECT * FROM user_startups WHERE user_id = ?').all(userId);
};

const addUserStartup = (userId, startup) => {
  try {
    const stmt = db.prepare('INSERT INTO user_startups (user_id, startup_name) VALUES (?, ?)');
    stmt.run(userId, startup);
    return true;
  } catch (err) {
    console.error('Error adding startup:', err);
    return false;
  }
};

const changePassword = (userId, newPassword) => {
  try {
    const stmt = db.prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    stmt.run(newPassword, userId);
    return true;
  } catch (err) {
    console.error('Error changing password:', err);
    return false;
  }
};

const getApplicationStatus = (userId, labId) => {
  const result = db.prepare('SELECT status FROM applications WHERE user_id = ? AND lab_id = ?').get(userId, labId);
  return result ? result.status : null;
};

const updateUserProfile = (userId, profileData) => {
  const {
    first_name, last_name, phone, bio, location, years_experience,
    current_position, company_name, website, linkedin_url, github_url
  } = profileData;
  
  const stmt = db.prepare(`
    UPDATE users SET 
      first_name = ?, last_name = ?, phone = ?, bio = ?, location = ?,
      years_experience = ?, current_position = ?, company_name = ?, 
      website = ?, linkedin_url = ?, github_url = ?
    WHERE id = ?
  `);
  
  return stmt.run(
    first_name, last_name, phone, bio, location, years_experience,
    current_position, company_name, website, linkedin_url, github_url, userId
  );
};

const markProfileCompleted = (userId) => {
  const stmt = db.prepare('UPDATE users SET profile_completed = 1 WHERE id = ?');
  return stmt.run(userId);
};

const markOnboardingCompleted = (userId) => {
  const stmt = db.prepare('UPDATE users SET onboarding_completed = 1 WHERE id = ?');
  return stmt.run(userId);
};

const getUserProfile = (userId) => {
  return db.prepare(`
    SELECT id, email, role, first_name, last_name, phone, bio, location,
           years_experience, current_position, company_name, website,
           linkedin_url, github_url, profile_completed, onboarding_completed,
           created_at
    FROM users WHERE id = ?
  `).get(userId);
};

const findAllUsers = () => {
  return db.prepare('SELECT id, email, role, password_hash FROM users').all();
};

module.exports = {
  findAllUsers,
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
