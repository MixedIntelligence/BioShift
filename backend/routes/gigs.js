const express = require('express');
const router = express.Router();
const gigModel = require('../models/gig');
const { createNotification } = require('../models/notification');
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const Joi = require('joi');
const auditLog = require('../middleware/auditLog');

const gigSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow('').max(1000),
  location: Joi.string().allow('').max(100),
  status: Joi.string().valid('open', 'closed', 'in_progress'),
});

// GET /api/gigs/search - Search for gigs
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      const gigs = await gigModel.listGigs();
      return res.json(gigs);
    }
    const gigs = await gigModel.searchGigs(q);
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search for gigs' });
  }
});


// GET /api/gigs - List gigs/projects
router.get(
  '/',
  authenticateToken,
  requireRole('Admin', 'Lab', 'Worker', 'Provider'),
  async (req, res) => {
    try {
      const gigs = await gigModel.listGigs();
      res.json(gigs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch gigs' });
    }
  }
);

// POST /api/gigs - Create gig/project
router.post(
  '/',
  authenticateToken,
  requireRole('Lab', 'Admin'),
  async (req, res) => {
    const { error, value } = gigSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { title, description, location } = value;
    try {
      const gig = await gigModel.createGig({
        title,
        description,
        userId: req.user.id,
        location,
      });
      res.status(201).json(gig);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create gig' });
    }
  }
);

// GET /api/gigs/:id - Gig/project details
router.get(
  '/:id',
  authenticateToken,
  requireRole('Admin', 'Lab', 'Worker', 'Provider'),
  async (req, res) => {
    try {
      const gig = await gigModel.getGigById(req.params.id);
      if (!gig) return res.status(404).json({ error: 'Gig not found' });
      res.json(gig);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch gig' });
    }
  }
);

// POST /api/gigs/:id/apply - Apply to gig (Worker, Provider)
router.post(
  '/:id/apply',
  authenticateToken,
  requireRole('Worker', 'Provider'),
  async (req, res) => {
    // Save application to DB
    const applied = await gigModel.applyToGig(req.params.id, req.user.id);
    if (!applied)
      return res.status(400).json({ error: 'Already applied or error' });
    
    const gig = await gigModel.getGigById(req.params.id);
    if (gig) {
      const message = `User ${req.user.username} has applied to your gig: ${gig.title}`;
      await createNotification(gig.user_id, message);
    }

    auditLog('apply_gig', req.user, { gigId: req.params.id });
    res.json({ message: `User ${req.user.id} applied to gig ${req.params.id}` });
  }
);

// PUT /api/gigs/:id - Edit gig/project (Lab, Admin)
router.put(
  '/:id',
  authenticateToken,
  requireRole('Lab', 'Admin'),
  async (req, res) => {
    const { error, value } = gigSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { title, description, status, location } = value;
    const updated = await gigModel.updateGig(
      req.params.id,
      req.user,
      { title, description, status, location }
    );
    auditLog('edit_gig', req.user, { gigId: req.params.id });
    if (!updated)
      return res.status(404).json({ error: 'Gig not found or forbidden' });
    res.json({ message: 'Gig updated' });
  }
);

// DELETE /api/gigs/:id - Delete gig/project (Lab, Admin)
router.delete(
  '/:id',
  authenticateToken,
  requireRole('Lab', 'Admin'),
  async (req, res) => {
    const deleted = await gigModel.deleteGig(req.params.id, req.user);
    auditLog('delete_gig', req.user, { gigId: req.params.id });
    if (!deleted)
      return res.status(404).json({ error: 'Gig not found or forbidden' });
    res.json({ message: 'Gig deleted' });
  }
);

// GET /api/gigs/:id/applications - List applications for a gig (Lab, Admin)
router.get(
  '/:id/applications',
  authenticateToken,
  requireRole('Lab', 'Admin'),
  async (req, res) => {
    const applications = await gigModel.listApplications(req.params.id);
    res.json(applications);
  }
);

// GET /api/users/:id/applications - List gigs a user has applied to (self or Admin)
// (This would go in users.js, but can be referenced here for completeness)
// router.get(
//   '/users/:id/applications',
//   authenticateToken,
//   requireRole('Admin'),
//   async (req, res) => {
//     const { id } = req.params;
//     const applications = await gigModel.listUserApplications(id);
//     res.json(applications);
//   }
// );

module.exports = router;
