const express = require('express');
const router = express.Router();
const offeringModel = require('../models/offering');
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const Joi = require('joi');
const auditLog = require('../middleware/auditLog');

const offeringSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  subtitle: Joi.string().allow('').max(100),
  description: Joi.string().allow('').max(1000),
  img: Joi.string().allow('').uri(),
  offering_type: Joi.string().valid('SERVICE', 'EQUIPMENT', 'SOFTWARE', 'COURSE').required(),
  category: Joi.string().allow('').max(50),
  pricing_model: Joi.string().valid('FIXED', 'SUBSCRIPTION', 'PER_USE', 'FREE').required(),
  price: Joi.number().min(0),
  rating: Joi.number().min(0).max(5),
  url: Joi.string().allow('').uri(),
});

// GET /api/offerings - List all offerings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const offerings = await offeringModel.listOfferings();
    res.json(offerings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch offerings' });
  }
});

// GET /api/offerings/:id - Get a single offering
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const offering = await offeringModel.getOfferingById(req.params.id);
    if (!offering) return res.status(404).json({ error: 'Offering not found' });
    res.json(offering);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch offering' });
  }
});

// GET /api/offerings/my-offerings - List all offerings for the current provider
router.get('/my-offerings', [authenticateToken, requireRole('Provider', 'Admin')], async (req, res) => {
  try {
    const offerings = await offeringModel.listOfferingsByProvider(req.user.id);
    res.json(offerings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch offerings' });
  }
});

// POST /api/offerings - Create a new offering
router.post('/', [authenticateToken, requireRole('Provider', 'Admin')], async (req, res) => {
  const { error, value } = offeringSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const offering = await offeringModel.createOffering({
      ...value,
      provider_id: req.user.id,
    });
    auditLog('create_offering', req.user, { offeringId: offering.id });
    res.status(201).json(offering);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create offering' });
  }
});

// PUT /api/offerings/:id - Update an offering
router.put('/:id', [authenticateToken, requireRole('Provider', 'Admin')], async (req, res) => {
  const { error, value } = offeringSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const updated = await offeringModel.updateOffering(req.params.id, value);
    if (!updated) return res.status(404).json({ error: 'Offering not found or forbidden' });
    auditLog('edit_offering', req.user, { offeringId: req.params.id });
    res.json({ message: 'Offering updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update offering' });
  }
});

// DELETE /api/offerings/:id - Delete an offering
router.delete('/:id', [authenticateToken, requireRole('Provider', 'Admin')], async (req, res) => {
  try {
    const deleted = await offeringModel.deleteOffering(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Offering not found or forbidden' });
    auditLog('delete_offering', req.user, { offeringId: req.params.id });
    res.json({ message: 'Offering deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete offering' });
  }
});

module.exports = router;