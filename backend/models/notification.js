const db = require('./db');

function createNotification(userId, message) {
  const stmt = db.prepare('INSERT INTO notifications (user_id, message) VALUES (?, ?)');
  const info = stmt.run(userId, message);
  return { id: info.lastInsertRowid, userId, message };
}

function getNotifications(userId) {
  const stmt = db.prepare('SELECT * FROM notifications WHERE user_id = ? AND is_read = 0');
  return stmt.all(userId);
}

function markAsRead(notificationId) {
  const stmt = db.prepare('UPDATE notifications SET is_read = 1 WHERE notification_id = ?');
  const info = stmt.run(notificationId);
  return info.changes > 0;
}

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
};