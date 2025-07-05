const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticateToken = require('../middleware/auth');

// Apply for a gig
router.post('/', authenticateToken, (req, res) => {
  const { gig_id } = req.body;
  const user_id = req.user.id;

  try {
    // Create application
    const applyStmt = db.prepare('INSERT INTO applications (gig_id, user_id) VALUES (?, ?)');
    const applyResult = applyStmt.run(gig_id, user_id);

    // Create notification for the lab owner
    const gigStmt = db.prepare('SELECT user_id, title FROM gigs WHERE id = ?');
    const gig = gigStmt.get(gig_id);
    const notificationStmt = db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)');
    notificationStmt.run(gig.user_id, `You have a new applicant for your gig: "${gig.title}"`);

    res.status(201).json({ id: applyResult.lastInsertRowid, gig_id, user_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept an application
router.post('/:applicationId/accept', authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const updateStmt = db.prepare('UPDATE applications SET status = \'accepted\', accepted_at = CURRENT_TIMESTAMP WHERE id = ?');
    const updateResult = updateStmt.run(applicationId);

    if (updateResult.changes === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const applicationStmt = db.prepare('SELECT * FROM applications WHERE id = ?');
    const application = applicationStmt.get(applicationId);

    // Notify applicant
    const gigStmt = db.prepare('SELECT g.title, u.email as lab_email FROM gigs g JOIN users u ON g.user_id = u.id WHERE g.id = ?');
    const gig = gigStmt.get(application.gig_id);
    const notificationStmt = db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)');
    notificationStmt.run(application.user_id, `Congratulations! Your application for "${gig.title}" has been accepted. You can contact the lab at: ${gig.lab_email}`);

    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject an application
router.post('/:applicationId/reject', authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const stmt = db.prepare('UPDATE applications SET status = \'rejected\' WHERE id = ?');
    const result = stmt.run(applicationId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Notify applicant
    const applicationStmt = db.prepare('SELECT * FROM applications WHERE id = ?');
    const application = applicationStmt.get(applicationId);
    const gigStmt = db.prepare('SELECT title FROM gigs WHERE id = ?');
    const gig = gigStmt.get(application.gig_id);
    const notificationStmt = db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)');
    notificationStmt.run(application.user_id, `Regarding your application for "${gig.title}", the lab has decided to move forward with other candidates.`);


    res.json({ message: 'Application rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;