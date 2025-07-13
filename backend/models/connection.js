// Connection model for context-first messaging
const db = require('./db');

async function createConnection(userOneId, userTwoId) {
  if (userOneId === userTwoId) throw new Error('Cannot connect user to themselves');
  const query = `
    INSERT INTO connections (user_one_id, user_two_id)
    VALUES ($1, $2)
    ON CONFLICT (LEAST(user_one_id, user_two_id), GREATEST(user_one_id, user_two_id)) DO NOTHING
    RETURNING *;
  `;
  const result = await db.query(query, [userOneId, userTwoId]);
  return result.rows[0];
}

async function getConnectionsForUser(userId) {
  const query = `
    SELECT * FROM connections WHERE user_one_id = $1 OR user_two_id = $1;
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
}

module.exports = {
  createConnection,
  getConnectionsForUser,
};
