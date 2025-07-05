const express = require('express');
const router = express.Router();
const userModel = require('../models/user');
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

// GET /api/users/me - Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log('IN /me route, req.user:', req.user, 'req.user.id:', req.user.id, 'Type:', typeof req.user.id); // DEBUG
    const user = await userModel.findUserById(req.user.id); // Use id directly, do not convert
    console.log('DB user:', user); // DEBUG
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Return consistent user data (same as /api/auth/me)
    res.json({ 
      id: user.id, 
      email: user.email, 
      role: user.role, 
      created_at: user.created_at 
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// PUT /api/users/me - Update current user profile
router.put('/me', authenticateToken, (req, res) => {
  const { username, password } = req.body;
  // Allow self-update only
  const updated = userModel.updateUser(req.user.id, username, password);
  if (!updated) return res.status(404).json({ error: 'User not found or no changes' });
  res.json({ message: 'Profile updated' });
});

// POST /api/users/me/password - Change password
router.post('/me/password', authenticateToken, async (req, res) => {
  console.log('IN /me/password route, req.user:', req.user); // DEBUG
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ error: 'New password required' });
  const changed = await userModel.changePassword(req.user.id, newPassword);
  if (!changed) return res.status(400).json({ error: 'Password not changed' });
  res.json({ message: 'Password changed' });
});

// GET /api/users/me/upskill - List upskill/certifications
router.get('/me/upskill', authenticateToken, async (req, res) => {
  const upskills = await userModel.getUserUpskill(req.user.id);
  res.json(upskills);
});

// POST /api/users/me/upskill - Add upskill/certification
router.post('/me/upskill', authenticateToken, async (req, res) => {
  const { upskill } = req.body;
  const added = await userModel.addUserUpskill(req.user.id, upskill);
  if (!added) return res.status(400).json({ error: 'Upskill not added' });
  res.json({ message: 'Upskill added' });
});

// GET /api/users/me/payments - Get payment/banking info
router.get('/me/payments', authenticateToken, async (req, res) => {
  const payments = await userModel.getUserPayments(req.user.id);
  res.json(payments);
});

// PUT /api/users/me/payments - Update payment/banking info
router.put('/me/payments', authenticateToken, async (req, res) => {
  const { paymentInfo } = req.body;
  const updated = await userModel.updateUserPayments(req.user.id, paymentInfo);
  if (!updated) return res.status(400).json({ error: 'Payment info not updated' });
  res.json({ message: 'Payment info updated' });
});

// GET /api/users/me/history - Get user activity/history
router.get('/me/history', authenticateToken, async (req, res) => {
  console.log('IN /me/history route, req.user:', req.user); // DEBUG
  const history = await userModel.getUserHistory(req.user.id);
  res.json(Array.isArray(history) ? history : []);
});

// GET /api/users/me/startups - List user startups
router.get('/me/startups', authenticateToken, async (req, res) => {
  const startups = await userModel.getUserStartups(req.user.id);
  res.json(startups);
});

// POST /api/users/me/startups - Add user startup
router.post('/me/startups', authenticateToken, async (req, res) => {
  const { startup } = req.body;
  const added = await userModel.addUserStartup(req.user.id, startup);
  if (!added) return res.status(400).json({ error: 'Startup not added' });
  res.json({ message: 'Startup added' });
});

// GET /api/users/me/documents - List user documents
router.get('/me/documents', authenticateToken, async (req, res) => {
  const docs = await userModel.getUserDocuments(req.user.id);
  res.json(docs);
});

// POST /api/users/me/documents - Upload user document
router.post('/me/documents', authenticateToken, async (req, res) => {
  const { document } = req.body;
  const added = await userModel.addUserDocument(req.user.id, document);
  if (!added) return res.status(400).json({ error: 'Document not added' });
  res.json({ message: 'Document added' });
});

// GET /api/users/me/publications - List user publications
router.get('/me/publications', authenticateToken, async (req, res) => {
  const pubs = await userModel.getUserPublications(req.user.id);
  res.json(pubs);
});

// POST /api/users/me/publications - Add user publication
router.post('/me/publications', authenticateToken, async (req, res) => {
  const { publication } = req.body;
  const added = await userModel.addUserPublication(req.user.id, publication);
  if (!added) return res.status(400).json({ error: 'Publication not added' });
  res.json({ message: 'Publication added' });
});

// GET /api/users/me/patents - List user patents
router.get('/me/patents', authenticateToken, async (req, res) => {
  const patents = await userModel.getUserPatents(req.user.id);
  res.json(patents);
});

// POST /api/users/me/patents - Add user patent
router.post('/me/patents', authenticateToken, async (req, res) => {
  const { patent } = req.body;
  const added = await userModel.addUserPatent(req.user.id, patent);
  if (!added) return res.status(400).json({ error: 'Patent not added' });
  res.json({ message: 'Patent added' });
});

// GET /api/users/me/bionics - List user bionics/AI assets
router.get('/me/bionics', authenticateToken, async (req, res) => {
  const bionics = await userModel.getUserBionics(req.user.id);
  res.json(bionics);
});


// PUT /api/users/:id - Update user profile
router.put('/:id', authenticateToken, requireRole('Admin', 'Lab', 'Worker', 'Provider'), async (req, res) => {
  // Only allow self-update unless Admin
  if (req.user.role !== 'Admin' && req.user.id !== Number(req.params.id)) {
    return res.status(403).json({ error: 'Forbidden: can only update your own profile' });
  }
  const { username, password } = req.body;
  const updated = userModel.updateUser(Number(req.params.id), username, password);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'Profile updated' });
});

// GET /api/users/:id/history - Get user activity/history (mock)
router.get('/:id/history', authenticateToken, requireRole('Admin', 'Lab', 'Worker', 'Provider'), (req, res) => {
  // For now, return a mock history
  res.json({ userId: req.params.id, history: [
    { action: 'login', timestamp: new Date().toISOString() },
    { action: 'created_gig', timestamp: new Date().toISOString() }
  ] });
});

// GET /api/users/:id/applications - List gigs a user has applied to (self or Admin)
router.get('/:id/applications', authenticateToken, requireRole('Admin', 'Lab', 'Worker', 'Provider'), async (req, res) => {
  // Only allow self or Admin
  if (req.user.role !== 'Admin' && req.user.id !== Number(req.params.id)) {
    return res.status(403).json({ error: 'Forbidden: can only view your own applications' });
  }
  const applications = await userModel.listUserApplications(req.params.id);
  res.json(applications);
});

// GET /api/users/:userId/profile - Get public user profile
router.get('/:userId/profile', authenticateToken, async (req, res) => {
  try {
    const userProfile = userModel.getUserProfile(req.params.userId);
    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// GET /api/users/me/education - List user education
router.get('/me/education', authenticateToken, async (req, res) => {
  const education = await userModel.getUserEducation(req.user.id);
  res.json(education);
});

// POST /api/users/me/education - Add user education
router.post('/me/education', authenticateToken, async (req, res) => {
  const { education } = req.body;
  const added = await userModel.addUserEducation(req.user.id, education);
  if (!added) return res.status(400).json({ error: 'Education not added' });
  res.json({ message: 'Education added' });
});

module.exports = router;
