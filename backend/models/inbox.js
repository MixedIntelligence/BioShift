const db = require('./db');

const { createConnection } = require('./connection');
async function createConversation(subject, participantIds, context = {}) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    // Insert conversation with optional context columns
    let convQuery = 'INSERT INTO conversations (subject';
    let convValues = [subject];
    let valuePlaceholders = ['$1'];
    let idx = 2;
    if (context.gigId) {
      convQuery += ', context_gig_id';
      convValues.push(context.gigId);
      valuePlaceholders.push(`$${idx++}`);
    }
    if (context.offeringId) {
      convQuery += ', context_offering_id';
      convValues.push(context.offeringId);
      valuePlaceholders.push(`$${idx++}`);
    }
    convQuery += `) VALUES (${valuePlaceholders.join(', ')}) RETURNING id`;
    const convResult = await client.query(convQuery, convValues);
    const conversationId = convResult.rows[0].id;

    // Add participants
    const partQuery = 'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2)';
    for (const userId of participantIds) {
      await client.query(partQuery, [conversationId, userId]);
    }

    // Create connection between first two participants if context is provided
    if (participantIds.length >= 2 && (context.gigId || context.offeringId)) {
      await createConnection(participantIds[0], participantIds[1]);
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
  // Get conversations and latest message info
  const query = `
    SELECT
      c.id,
      c.subject,
      COALESCE(
        (SELECT m.sent_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.sent_at DESC LIMIT 1),
        c.created_at
      ) as created_at,
      (SELECT (p.first_name || ' ' || p.last_name) FROM user_profiles p JOIN messages m ON p.user_id = m.sender_id WHERE m.conversation_id = c.id ORDER BY m.sent_at DESC LIMIT 1) as last_sender,
      (SELECT m.body FROM messages m WHERE m.conversation_id = c.id ORDER BY m.sent_at DESC LIMIT 1) as last_message,
      (SELECT m.sender_id FROM messages m WHERE m.conversation_id = c.id ORDER BY m.sent_at DESC LIMIT 1) as last_sender_id
    FROM conversations c
    JOIN conversation_participants cp ON c.id = cp.conversation_id
    WHERE cp.user_id = $1
    ORDER BY created_at DESC
  `;
  const result = await db.query(query, [userId]);
  // Add unreaded property: true if last message not sent by user
  return result.rows.map(row => ({
    id: row.id,
    subject: row.subject,
    last_sender: row.last_sender,
    last_message: row.last_message,
    created_at: row.created_at,
    unreaded: row.last_sender_id !== userId && row.last_sender_id !== null
  }));
}

async function getMessagesByConversationId(conversationId, userId) {
  const participationCheck = await db.query(
    'SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
    [conversationId, userId]
  );

  if (participationCheck.rows.length === 0) {
    throw new Error('User is not a participant in this conversation.');
  }

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