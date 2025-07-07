const db = require('./db');

async function createNotification(userId, message) {
  const query = 'INSERT INTO notifications (user_id, message) VALUES ($1, $2) RETURNING *';
  const result = await db.query(query, [userId, message]);
  return result.rows[0];
}

async function getNotifications(userId) {
  const result = await db.query('SELECT * FROM notifications WHERE user_id = $1 AND is_read = false', [userId]);
  return result.rows;
}

async function markAsRead(notificationId) {
  const result = await db.query('UPDATE notifications SET is_read = true WHERE id = $1', [notificationId]);
  return result.rowCount > 0;
}

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
};