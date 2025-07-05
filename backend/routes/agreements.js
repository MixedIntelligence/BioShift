const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticateToken = require('../middleware/auth');

// Create a new agreement from an accepted application
router.post('/', authenticateToken, async (req, res) => {
  const { applicationId, terms, totalAmount, commissionRate } = req.body;
  const labId = req.user.id;

  if (!applicationId || !totalAmount || !commissionRate) {
    return res.status(400).json({ error: 'Missing required fields: applicationId, totalAmount, commissionRate.' });
  }

  try {
    // 1. Fetch the application details to ensure it's valid and belongs to the lab
    const appQuery = 'SELECT * FROM applications WHERE id = $1 AND status = \'accepted\'';
    const { rows: applications } = await db.query(appQuery, [applicationId]);
    const application = applications[0];

    if (!application) {
      return res.status(404).json({ error: 'Accepted application not found.' });
    }

    // 2. Verify that the gig belongs to the authenticated lab user
    const gigQuery = 'SELECT user_id FROM gigs WHERE id = $1';
    const { rows: gigs } = await db.query(gigQuery, [application.gig_id]);
    if (gigs.length === 0 || gigs[0].user_id !== labId) {
        return res.status(403).json({ error: 'Forbidden: You do not own the gig associated with this application.' });
    }

    // 3. Calculate commission
    const commissionAmount = parseFloat(totalAmount) * parseFloat(commissionRate);

    // 4. Create the agreement
    const insertQuery = `
      INSERT INTO agreements (application_id, gig_id, lab_id, worker_id, terms, total_amount, commission_rate, commission_amount, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
      RETURNING *;
    `;
    const values = [
      applicationId,
      application.gig_id,
      labId,
      application.user_id,
      terms,
      totalAmount,
      commissionRate,
      commissionAmount
    ];

    const { rows: newAgreements } = await db.query(insertQuery, values);

    res.status(201).json(newAgreements[0]);

  } catch (error) {
    console.error('Error creating agreement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all agreements for the authenticated user (as lab or worker)
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const query = 'SELECT * FROM agreements WHERE lab_id = $1 OR worker_id = $1 ORDER BY created_at DESC';
        const { rows } = await db.query(query, [userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching agreements:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get a specific agreement by ID
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const query = 'SELECT * FROM agreements WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        const agreement = rows[0];

        if (!agreement) {
            return res.status(404).json({ error: 'Agreement not found.' });
        }

        // Ensure the user is a party to the agreement
        if (agreement.lab_id !== userId && agreement.worker_id !== userId) {
            return res.status(403).json({ error: 'Forbidden: You are not authorized to view this agreement.' });
        }

        res.json(agreement);
    } catch (error) {
        console.error('Error fetching agreement:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update the status of an agreement (e.g., worker accepts, lab marks as complete)
router.put('/:id/status', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // e.g., 'active', 'completed', 'terminated'
    const userId = req.user.id;

    if (!status) {
        return res.status(400).json({ error: 'Status is required.' });
    }

    try {
        // First, get the agreement to verify ownership and current status
        const getQuery = 'SELECT * FROM agreements WHERE id = $1';
        const { rows: agreements } = await db.query(getQuery, [id]);
        const agreement = agreements[0];

        if (!agreement) {
            return res.status(404).json({ error: 'Agreement not found.' });
        }

        // Authorization: only a party to the agreement can change its status
        if (agreement.lab_id !== userId && agreement.worker_id !== userId) {
            return res.status(403).json({ error: 'Forbidden: You are not authorized to update this agreement.' });
        }
        
        // Logic for status transition, e.g., a worker can accept a 'pending' agreement
        if (agreement.status === 'pending' && status === 'active' && agreement.worker_id === userId) {
            // Worker accepts
        } else if (agreement.status === 'active' && status === 'completed' && agreement.lab_id === userId) {
            // Lab marks as complete
        } else {
            // More complex state transition logic could be added here
            // For now, we'll allow status changes by either party if the state is not final
        }

        const updateQuery = 'UPDATE agreements SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
        const { rows: updatedAgreements } = await db.query(updateQuery, [status, id]);

        res.json(updatedAgreements[0]);
    } catch (error) {
        console.error('Error updating agreement status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;