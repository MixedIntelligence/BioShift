const db = require('./db');

async function createConversation(subject, participantIds) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const convQuery = 'INSERT INTO conversations (subject) VALUES ($1) RETURNING id';
    const convResult = await client.query(convQuery, [subject]);
    const conversationId = convResult.rows[0].id;

    const partQuery = 'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)';
    for (const userId of participantIds) {
      await client.query(partQuery, [conversationId, userId]);
    }
    
    await client.query('COMMIT');
    return { id: conversationId, subject, participants: participantIds };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function sendMessage(conversationId, senderId, body) {
  const query = 'INSERT INTO messages (conversation_id, sender_id, body) VALUES ($1, $2, $3) RETURNING *';
  const result = await db.query(query, [conversationId, senderId, body]);
  return result.rows[0];
}

async function getConversationsByUserId(userId) {
  const query = `
    SELECT
      c.id,
      c.subject,
      (SELECT (p.first_name || ' ' || p.last_name) FROM user_profiles p JOIN messages m ON p.user_id = m.sender_id WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_sender,
      (SELECT m.body FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
      c.created_at
    FROM conversations c
    JOIN conversation_participants cp ON c.id = cp.conversation_id
    WHERE cp.user_id = $1
    ORDER BY c.created_at DESC
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
}

async function getMessagesByConversationId(conversationId) {
  const query = `
    SELECT
      m.id,
      m.body,
      m.created_at,
      (p.first_name || ' ' || p.last_name) as sender_name
    FROM messages m
    JOIN user_profiles p ON m.sender_id = p.user_id
    WHERE m.conversation_id = $1
    ORDER BY m.created_at ASC
  `;
  const result = await db.query(query, [conversationId]);
  return result.rows;
}

module.exports = {
  createConversation,
  sendMessage,
  getConversationsByUserId,
  getMessagesByConversationId,
};