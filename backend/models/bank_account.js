const db = require('./db');

async function createBankAccount(userId, accountHolderName, accountNumber, routingNumber) {
  const query = `
    INSERT INTO bank_accounts (user_id, account_holder_name, account_number, routing_number, created_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const params = [userId, accountHolderName, accountNumber, routingNumber, new Date().toISOString()];
  const result = await db.query(query, params);
  return result.rows[0];
}

async function getBankAccountsByUserId(userId) {
  const result = await db.query('SELECT * FROM bank_accounts WHERE user_id = $1', [userId]);
  return result.rows;
}

async function deleteBankAccount(id) {
  const result = await db.query('DELETE FROM bank_accounts WHERE id = $1', [id]);
  return result.rowCount > 0;
}

module.exports = {
  createBankAccount,
  getBankAccountsByUserId,
  deleteBankAccount,
};