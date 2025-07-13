const express = require('express');
const router = express.Router();
const applicationModel = require('../models/application');
const gigModel = require('../models/gig');
const { createNotification } = require('../models/notification');
const authenticateToken = require('../middleware/auth');

// Apply for a gig
router.post('/', authenticateToken, async (req, res) => {
  const { gig_id } = req.body;
  const user_id = req.user.id;

  try {
    const application = await applicationModel.createApplication({ gig_id, user_id });
    
    const gig = await gigModel.getGigById(gig_id);
    if (gig) {
      const message = `You have a new applicant for your gig: "${gig.title}"`;
      await createNotification(gig.user_id, message);
    }

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept an application
router.post('/:applicationId/accept', authenticateToken, async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const success = await applicationModel.updateApplicationStatus(applicationId, 'accepted');

    if (!success) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = await applicationModel.getApplicationById(applicationId);
    const gig = await gigModel.getGigById(application.gig_id);
    
    if (gig) {
        const message = `Congratulations! Your application for "${gig.title}" has been accepted.`;
        await createNotification(application.user_id, message);
    }

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
    const success = await applicationModel.updateApplicationStatus(applicationId, 'rejected');

    if (!success) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = await applicationModel.getApplicationById(applicationId);
    const gig = await gigModel.getGigById(application.gig_id);

    if (gig) {
        const message = `Regarding your application for "${gig.title}", the lab has decided to move forward with other candidates.`;
        await createNotification(application.user_id, message);
    }

    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;