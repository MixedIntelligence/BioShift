const db = require('./db');

function createConversation(subject, participantIds) {
  const conversationStmt = db.prepare('INSERT INTO conversations (subject) VALUES (?)');
  const conversationResult = conversationStmt.run(subject);
  const conversationId = conversationResult.lastInsertRowid;

  const participantStmt = db.prepare('INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?, ?)');
  for (const userId of participantIds) {
    participantStmt.run(conversationId, userId);
  }

  return { id: conversationId, subject, participants: participantIds };
}

function sendMessage(conversationId, senderId, body) {
  const messageStmt = db.prepare('INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)');
  const messageResult = messageStmt.run(conversationId, senderId, body);
  return { id: messageResult.lastInsertRowid, conversationId, senderId, body };
}

function getConversationsByUserId(userId) {
  const stmt = db.prepare(`
    SELECT
      c.id,
      c.subject,
      (SELECT u.name FROM users u JOIN messages m ON u.id = m.sender_id WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_sender,
      (SELECT m.body FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
      c.created_at
    FROM conversations c
    JOIN conversation_participants cp ON c.id = cp.conversation_id
    WHERE cp.user_id = ?
    ORDER BY c.created_at DESC
  `);
  return stmt.all(userId);
}

function getMessagesByConversationId(conversationId) {
  const stmt = db.prepare(`
    SELECT
      m.id,
      m.body,
      m.created_at,
      u.name as sender_name
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.conversation_id = ?
    ORDER BY m.created_at ASC
  `);
  return stmt.all(conversationId);
}

module.exports = {
  createConversation,
  sendMessage,
  getConversationsByUserId,
  getMessagesByConversationId,
};