const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader); // DEBUG
  if (!authHeader) {
    console.error('No Authorization header found');
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification failed:', err.message, 'Token:', token, 'Secret:', process.env.JWT_SECRET); // DEBUG
      return res.status(403).json({ error: 'Invalid token' });
    }
    console.log('Decoded JWT in middleware:', user, 'Type of id:', typeof user.id); // DEBUG
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
