// Simple audit logger (writes to a file)
const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, '../audit.log');

function auditLog(action, user, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    user: user ? { id: user.id, username: user.username, role: user.role } : null,
    action,
    details,
  };
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
}

module.exports = auditLog;
