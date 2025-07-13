const express = require('express');
const router = express.Router();
const { createConversation, sendMessage, getConversationsByUserId, getMessagesByConversationId } = require('../models/inbox');
const authenticateToken = require('../middleware/auth');

// Get all conversations for the logged-in user
router.get('/conversations', authenticateToken, (req, res) => {
  (async () => {
    try {
      const conversations = await getConversationsByUserId(req.user.id);
      res.json(conversations);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve conversations' });
    }
  })();
});

// Get all messages for a conversation
router.get('/conversations/:id', authenticateToken, async (req, res) => {
  try {
    const messages = await getMessagesByConversationId(req.params.id, req.user.id);
    res.json(messages);
  } catch (err) {
    if (err.message === 'User is not a participant in this conversation.') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

// Create a new conversation
router.post('/conversations', authenticateToken, async (req, res) => {
  const { subject, participantIds, body, context } = req.body;
  const senderId = req.user.id;

  if (!participantIds || participantIds.length === 0) {
    return res.status(400).json({ error: 'At least one participant is required' });
  }

  try {
    const allParticipantIds = [...new Set([senderId, ...participantIds])];
    const conversation = await createConversation(subject, allParticipantIds, context);
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

// Tier 2: Compose message to a 1st-degree connection (reuses existing conversation or creates new if none)
router.post('/compose', authenticateToken, async (req, res) => {
  const { recipientId, subject, body } = req.body;
  const senderId = req.user.id;

  try {
    // Find existing conversation between sender and recipient
    const conversations = await getConversationsByUserId(senderId);
    let conversation = conversations.find(c => c.participants && c.participants.includes(recipientId));
    if (!conversation) {
      // Create new conversation if none exists
      conversation = await createConversation(subject, [recipientId], {});
    }
    const message = await sendMessage(conversation.id, senderId, body);
    res.status(201).json({ conversation, message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compose message' });
  }
});

module.exports = router;