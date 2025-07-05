const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getApplicationById, updateApplicationStatus } = require('../models/application');
const { findUserById } = require('../models/user');
const gigModel = require('../models/gig'); // Assuming gig model exists for owner check

// Middleware to check if the requester is the gig owner
async function isGigOwner(req, res, next) {
  try {
    const application = await getApplicationById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }
    const gig = await gigModel.getGigById(application.gig_id); // Assumes getGigById exists
    if (gig.lab_id !== req.user.id) {
      return res.status(403).json({ msg: 'User not authorized to perform this action' });
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// POST /api/connect/:applicationId/accept
router.post('/:applicationId/accept', [auth, isGigOwner], async (req, res) => {
  try {
    const updated = await updateApplicationStatus(req.params.applicationId, 'accepted');
    if (updated) {
      // TODO: Add notification logic here
      res.json({ msg: 'Application accepted' });
    } else {
      res.status(404).json({ msg: 'Application not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/connect/:applicationId/reject
router.post('/:applicationId/reject', [auth, isGigOwner], async (req, res) => {
  try {
    const updated = await updateApplicationStatus(req.params.applicationId, 'rejected');
    if (updated) {
      res.json({ msg: 'Application rejected' });
    } else {
      res.status(404).json({ msg: 'Application not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;