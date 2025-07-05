const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticateToken = require('../middleware/auth');

// Initiate a payment for an agreement
// This is a simplified version. In a real-world scenario, this would
// integrate with a payment gateway like Stripe.
router.post('/payment', authenticateToken, async (req, res) => {
  const { agreementId, paymentMethodId } = req.body;
  const labId = req.user.id;

  if (!agreementId) {
    return res.status(400).json({ error: 'Missing required field: agreementId.' });
  }

  try {
    // 1. Get agreement details, ensuring it's active and belongs to the payer
    const agreementQuery = 'SELECT * FROM agreements WHERE id = $1 AND lab_id = $2 AND status = \'active\'';
    const { rows: agreements } = await db.query(agreementQuery, [agreementId, labId]);
    const agreement = agreements[0];

    if (!agreement) {
      return res.status(404).json({ error: 'Active agreement not found or you are not authorized to pay for it.' });
    }

    // 2. "Process" payment (mocking integration with a payment gateway)
    // In a real implementation, you would use the paymentMethodId to charge the user.
    const paymentGatewayId = `mock_charge_${Date.now()}`;

    // Use a database transaction to ensure atomicity
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // 3. Create a "payment" transaction record
      const insertPaymentQuery = `
        INSERT INTO transactions (agreement_id, from_user_id, to_user_id, transaction_type, amount, status, payment_gateway_id)
        VALUES ($1, $2, $3, 'payment', $4, 'completed', $5)
        RETURNING *;
      `;
      const paymentValues = [agreement.id, agreement.lab_id, agreement.worker_id, agreement.total_amount, paymentGatewayId];
      const { rows: newTransactions } = await client.query(insertPaymentQuery, paymentValues);

      // 4. Create a "commission" transaction record for the platform
      const insertCommissionQuery = `
        INSERT INTO transactions (agreement_id, from_user_id, to_user_id, transaction_type, amount, status, payment_gateway_id)
        VALUES ($1, $2, $3, 'commission', $4, 'completed', $5)
        RETURNING *;
      `;
      // Assuming a platform user (e.g., user_id 1) receives the commission
      const commissionValues = [agreement.id, agreement.lab_id, 1, agreement.commission_amount, paymentGatewayId];
      await client.query(insertCommissionQuery, commissionValues);
      
      // 5. Update the agreement status to 'paid'
      const updateAgreementQuery = 'UPDATE agreements SET status = \'paid\' WHERE id = $1';
      await client.query(updateAgreementQuery, [agreementId]);

      await client.query('COMMIT');
      res.status(201).json(newTransactions[0]);

    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Internal server error during payment processing.' });
  }
});

// Get all transactions for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
        SELECT t.*, a.terms as agreement_terms 
        FROM transactions t
        JOIN agreements a ON t.agreement_id = a.id
        WHERE t.from_user_id = $1 OR t.to_user_id = $1 
        ORDER BY t.created_at DESC
    `;
    const { rows } = await db.query(query, [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific transaction by ID
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const query = 'SELECT * FROM transactions WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        const transaction = rows[0];

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found.' });
        }

        // Ensure the user is a party to the transaction
        if (transaction.from_user_id !== userId && transaction.to_user_id !== userId) {
            return res.status(403).json({ error: 'Forbidden: You are not authorized to view this transaction.' });
        }

        res.json(transaction);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;