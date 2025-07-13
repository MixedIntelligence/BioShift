const express = require('express');
const router = express.Router();
const { StreamChat } = require('stream-chat');
const authenticateToken = require('../middleware/auth');

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error('Stream API key or secret not found. Please check your .env file.');
} else {
  const serverClient = StreamChat.getInstance(apiKey, apiSecret);

  router.post('/token', authenticateToken, (req, res) => {
    const userId = req.user.id.toString();
    try {
      const token = serverClient.createToken(userId);
      res.json({ token });
    } catch (err) {
      console.error('Error creating Stream token:', err);
      res.status(500).json({ error: 'Failed to create Stream token' });
    }
  });
}

module.exports = router;