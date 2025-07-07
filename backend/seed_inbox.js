// Seed test inbox data for Postgres using pg
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function seedInbox() {
  await client.connect();
  // Insert a test conversation
  const conversationRes = await client.query(
    `INSERT INTO conversations (subject, created_at) VALUES ($1, NOW()) RETURNING id`,
    ['Test Conversation']
  );
  const conversationId = conversationRes.rows[0].id;

  // Insert test messages
  await client.query(
    `INSERT INTO messages (conversation_id, sender_id, body, created_at) VALUES ($1, $2, $3, NOW())`,
    [conversationId, 1, 'Hello, this is a test message!']
  );
  await client.query(
    `INSERT INTO messages (conversation_id, sender_id, body, created_at) VALUES ($1, $2, $3, NOW())`,
    [conversationId, 2, 'Reply from another user.']
  );

  console.log('Seeded test inbox data.');
  await client.end();
}

seedInbox().catch(console.error);
