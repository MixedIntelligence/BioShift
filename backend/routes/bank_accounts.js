const express = require('express');
const router = express.Router();
const BankAccount = require('../models/bank_account');
const authenticateToken = require('../middleware/auth');

// Add a new bank account
router.post('/', authenticateToken, (req, res) => {
  const { accountHolderName, accountNumber, routingNumber } = req.body;
  const userId = req.user.id;

  try {
    const newAccount = BankAccount.createBankAccount(userId, accountHolderName, accountNumber, routingNumber);
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bank accounts for the authenticated user
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;

  try {
    const accounts = BankAccount.getBankAccountsByUserId(userId);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a bank account
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // First, verify that the bank account belongs to the authenticated user
    const account = BankAccount.getBankAccountsByUserId(userId).find(acc => acc.id === parseInt(id));
    if (!account) {
      return res.status(404).json({ error: 'Bank account not found or you do not have permission to delete it.' });
    }

    const deleted = BankAccount.deleteBankAccount(id);
    if (deleted) {
      res.json({ message: 'Bank account deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Bank account not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;