const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userModel = require('../models/user');
const providerModel = require('../models/provider');
const authenticateToken = require('../middleware/auth');
const Joi = require('joi');
const auditLog = require('../middleware/auditLog');

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid('Admin', 'Lab', 'Worker', 'Provider').default('Worker'),
  companyName: Joi.string().when('role', { is: 'Provider', then: Joi.required() }),
  website: Joi.string().uri().when('role', { is: 'Provider', then: Joi.required() }),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { email, password, role, companyName, website } = value;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
    console.log('Registering user with email:', email);
  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('Password hash generated:', passwordHash);
    const user = await userModel.createUser(email, passwordHash, role);
    if (role === 'Provider') {
    console.log('User created:', user);
      await providerModel.createProvider(user.id, companyName, website);
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    auditLog('register', user, { ip: req.ip });
    res.status(201).json({ token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  const { email, password } = value;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    console.log(`[AUTH] Attempting login for: ${email}`);
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      console.log(`[AUTH] User not found: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log(`[AUTH] User found: ${user.email}. Comparing passwords...`);
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      console.log(`[AUTH] Password validation failed for user: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log(`[AUTH] Login successful for user: ${email}`);
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    auditLog('login', user, { ip: req.ip });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // Get full user data from database for consistency
    const user = await userModel.findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
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

// GET /api/auth/debug/users
router.get('/debug/users', async (req, res) => {
  try {
    console.log('[AUTH_DEBUG] Fetching all users from the database...');
    const users = await userModel.findAllUsers();
    console.log(`[AUTH_DEBUG] Found ${users.length} users.`);
    res.json(users);
  } catch (err) {
    console.error('[AUTH_DEBUG] Error fetching all users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
