const request = require('supertest');
const app = require('../index');
const db = require('../models/db');
const jwt = require('jsonwebtoken');

describe('Transactions API', () => {
  let labUser, workerUser, labToken, workerToken, gigId, applicationId, agreementId;

  beforeAll(async () => {
    // Clean up the database
    await db.query('DELETE FROM transactions');
    await db.query('DELETE FROM agreements');
    await db.query('DELETE FROM applications');
    await db.query('DELETE FROM gigs');
    await db.query('DELETE FROM users');

    // Create users
    const labRes = await request(app)
      .post('/api/auth/register')
      .send({ username: 'labuser_trans', password: 'password' });
    labUser = labRes.body.user;
    labToken = labRes.body.token;

    const workerRes = await request(app)
      .post('/api/auth/register')
      .send({ username: 'workeruser_trans', password: 'password' });
    workerUser = workerRes.body.user;
    workerToken = workerRes.body.token;

    // Create a gig
    const gigRes = await db.query(
      'INSERT INTO gigs (user_id, title, description, compensation) VALUES ($1, $2, $3, $4) RETURNING id',
      [labUser.id, 'Test Gig For Transaction', 'Test Description', '150']
    );
    gigId = gigRes.rows[0].id;

    // Create an application
    const appRes = await db.query(
      'INSERT INTO applications (gig_id, user_id, status) VALUES ($1, $2, $3) RETURNING id',
      [gigId, workerUser.id, 'accepted']
    );
    applicationId = appRes.rows[0].id;

    // Create an agreement
    const agreementRes = await request(app)
      .post('/api/agreements')
      .set('Authorization', `Bearer ${labToken}`)
      .send({
        applicationId,
        terms: 'Test Terms for Transaction',
        totalAmount: 1500,
        commissionRate: 0.1,
      });
    
    agreementId = agreementRes.body.id;

    // Worker accepts the agreement
    await request(app)
        .put(`/api/agreements/${agreementId}/status`)
        .set('Authorization', `Bearer ${workerToken}`)
        .send({ status: 'active' });
  });

  afterAll(() => {
    db.close();
  });

  describe('POST /api/transactions/payment', () => {
    it('should create a new payment transaction', async () => {
      const res = await request(app)
        .post('/api/transactions/payment')
        .set('Authorization', `Bearer ${labToken}`)
        .send({
          agreementId,
          paymentMethodId: 'mock_payment_method',
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.transaction_type).toBe('payment');
    });
  });

  describe('GET /api/transactions', () => {
    it('should get all transactions for the lab user', async () => {
      const res = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${labToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get all transactions for the worker user', async () => {
        const res = await request(app)
          .get('/api/transactions')
          .set('Authorization', `Bearer ${workerToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  describe('GET /api/transactions/:id', () => {
    let transactionId;

    beforeAll(async () => {
        const res = await request(app)
        .post('/api/transactions/payment')
        .set('Authorization', `Bearer ${labToken}`)
        .send({
          agreementId,
          paymentMethodId: 'mock_payment_method_2',
        });
        transactionId = res.body.id;
    });

    it('should get a specific transaction by id', async () => {
      const res = await request(app)
        .get(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${labToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', transactionId);
    });
  });
});