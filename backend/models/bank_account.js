const db = require('./db');

function createBankAccount(userId, accountHolderName, accountNumber, routingNumber) {
  const stmt = db.prepare(
    'INSERT INTO bank_accounts (user_id, account_holder_name, account_number, routing_number, created_at) VALUES (?, ?, ?, ?, ?)'
  );
  const now = new Date().toISOString();
  const info = stmt.run(userId, accountHolderName, accountNumber, routingNumber, now);
  return { id: info.lastInsertRowid, userId, accountHolderName, accountNumber, routingNumber, createdAt: now };
}

function getBankAccountsByUserId(userId) {
  const stmt = db.prepare('SELECT * FROM bank_accounts WHERE user_id = ?');
  return stmt.all(userId);
}

function deleteBankAccount(id) {
  const stmt = db.prepare('DELETE FROM bank_accounts WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

module.exports = {
  createBankAccount,
  getBankAccountsByUserId,
  deleteBankAccount,
};