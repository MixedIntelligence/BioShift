const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authenticateToken = require('../middleware/auth');
const { verifyDocument } = require('../services/mockVerificationClient');

router.post('/documents/:documentId/verify', authenticateToken, async (req, res) => {
  const { documentId } = req.params;
  const userId = req.user.id;

  try {
    // First, verify that the document belongs to the authenticated user
    const docStmt = db.prepare('SELECT user_id FROM user_documents WHERE id = ?');
    const document = docStmt.get(documentId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.user_id !== userId) {
      return res.status(403).json({ error: 'You are not authorized to verify this document' });
    }

    const verificationStatus = await verifyDocument(documentId);

    const stmt = db.prepare(
      'UPDATE user_documents SET verification_status = ? WHERE id = ?'
    );
    stmt.run(verificationStatus, documentId);

    res.json({ documentId, verification_status: verificationStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;