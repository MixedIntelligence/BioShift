const express = require('express');
const router = express.Router();
const { createConversation, sendMessage, getConversationsByUserId, getMessagesByConversationId } = require('../models/inbox');
const authenticateToken = require('../middleware/auth');

// Get all conversations for the logged-in user
router.get('/conversations', authenticateToken, (req, res) => {
  try {
    const conversations = getConversationsByUserId(req.user.id);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve conversations' });
  }
});

// Get all messages for a conversation
router.get('/conversations/:id', authenticateToken, (req, res) => {
  try {
    // TODO: Check if user is a participant in the conversation
    const messages = getMessagesByConversationId(req.params.id);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

// Create a new conversation
router.post('/conversations', authenticateToken, async (req, res) => {
  const { subject, participantIds, body } = req.body;
  const senderId = req.user.id;

  if (!participantIds || participantIds.length === 0) {
    return res.status(400).json({ error: 'At least one participant is required' });
  }

  try {
    const allParticipantIds = [...new Set([senderId, ...participantIds])];
    const conversation = await createConversation(subject, allParticipantIds);
    const message = await sendMessage(conversation.id, senderId, body);
    res.status(201).json({ conversation, message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Send a new message in an existing conversation
router.post('/messages', authenticateToken, async (req, res) => {
  const { conversationId, body } = req.body;
  const senderId = req.user.id;

  try {
    const message = await sendMessage(conversationId, senderId, body);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;