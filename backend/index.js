require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

if (process.env.NODE_ENV === 'production') {
  const allowedOrigins = [
    'https://bioshift.xyz',
    'https://www.bioshift.xyz',
    'https://bioshift-production.up.railway.app',
  ];
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }));
} else {
  // Allow all origins in development
  app.use(cors({ origin: true, credentials: true }));
}
app.use(express.json());

// Example route for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running.', timestamp: new Date().toISOString() });
});

// Removed all mock endpoints for production. Only real routes are active.

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const gigsRoutes = require('./routes/gigs');
app.use('/api/gigs', gigsRoutes);

const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

const paymentsRoutes = require('./routes/payments');
app.use('/api/payments', paymentsRoutes);

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

const applicationsRoutes = require('./routes/applications');
app.use('/api/applications', applicationsRoutes);

const notificationsRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationsRoutes);

const connectRoutes = require('./routes/connect');
app.use('/api/connect', connectRoutes);

const offeringsRoutes = require('./routes/offerings');
app.use('/api/offerings', offeringsRoutes);

const agreementsRoutes = require('./routes/agreements');
app.use('/api/agreements', agreementsRoutes);

const transactionsRoutes = require('./routes/transactions');
app.use('/api/transactions', transactionsRoutes);

const verificationRoutes = require('./routes/verification');
app.use('/api', verificationRoutes);

const providerRoutes = require('./routes/providers');
app.use('/api/provider', providerRoutes);

const inboxRoutes = require('./routes/inbox');
app.use('/api/inbox', inboxRoutes);

// TODO: Add bionics and integration routes

// Serve static files from the React app build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

// Only start the server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

module.exports = app;
