const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../models/notification');
const authenticateToken = require('../middleware/auth');

// GET /api/notifications - Fetch all unread notifications for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const notifications = await getNotifications(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// POST /api/notifications/:notificationId/mark-read - Mark a specific notification as read
router.post('/:notificationId/mark-read', authenticateToken, async (req, res) => {
  try {
    const updated = await markAsRead(req.params.notificationId);
    if (!updated) return res.status(404).json({ error: 'Notification not found' });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

module.exports = router;