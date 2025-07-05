const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// GET /api/payments - List transactions (Admin only)
router.get('/', authenticateToken, requireRole('Admin'), (req, res) => {
  res.json({ payments: [] }); // Mock data
});

// POST /api/payments/payout - Initiate payout (Admin only)
router.post('/payout', authenticateToken, requireRole('Admin'), (req, res) => {
  res.json({ message: 'Payout initiated (mock)' });
});

// GET /api/payments/methods - List payment methods (all roles)
router.get('/methods', authenticateToken, requireRole('Admin', 'Lab', 'Worker', 'Provider'), (req, res) => {
  res.json({ methods: ['bank_transfer', 'paypal'] });
});

module.exports = router;
