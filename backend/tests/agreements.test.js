const request = require('supertest');
const app = require('../index');
const db = require('../models/db');
const jwt = require('jsonwebtoken');

describe('Agreements API', () => {
  let labUser, workerUser, labToken, workerToken, gigId, applicationId;

  beforeAll(async () => {
    // Clean up the database
    await db.query('DELETE FROM agreements');
    await db.query('DELETE FROM applications');
    await db.query('DELETE FROM gigs');
    await db.query('DELETE FROM users');

    // Create users
    const labRes = await request(app)
      .post('/api/auth/register')
      .send({ username: 'labuser', password: 'password' });
    labUser = labRes.body.user;
    labToken = labRes.body.token;

    const workerRes = await request(app)
      .post('/api/auth/register')
      .send({ username: 'workeruser', password: 'password' });
    workerUser = workerRes.body.user;
    workerToken = workerRes.body.token;

    // Create a gig
    const gigRes = await db.query(
      'INSERT INTO gigs (user_id, title, description, compensation) VALUES ($1, $2, $3, $4) RETURNING id',
      [labUser.id, 'Test Gig', 'Test Description', '100']
    );
    gigId = gigRes.rows[0].id;

    // Create an application
    const appRes = await db.query(
      'INSERT INTO applications (gig_id, user_id, status) VALUES ($1, $2, $3) RETURNING id',
      [gigId, workerUser.id, 'accepted']
    );
    applicationId = appRes.rows[0].id;
  });

  afterAll(() => {
    db.close();
  });

  describe('POST /api/agreements', () => {
    it('should create a new agreement', async () => {
      const res = await request(app)
        .post('/api/agreements')
        .set('Authorization', `Bearer ${labToken}`)
        .send({
          applicationId,
          terms: 'Test Terms',
          totalAmount: 1000,
          commissionRate: 0.1,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.terms).toBe('Test Terms');
    });
  });

  describe('GET /api/agreements', () => {
    it('should get all agreements for the lab user', async () => {
      const res = await request(app)
        .get('/api/agreements')
        .set('Authorization', `Bearer ${labToken}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get all agreements for the worker user', async () => {
        const res = await request(app)
          .get('/api/agreements')
          .set('Authorization', `Bearer ${workerToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  describe('GET /api/agreements/:id', () => {
    let agreementId;

    beforeAll(async () => {
        const res = await request(app)
        .post('/api/agreements')
        .set('Authorization', `Bearer ${labToken}`)
        .send({
          applicationId,
          terms: 'Another Agreement',
          totalAmount: 2000,
          commissionRate: 0.15,
        });
        agreementId = res.body.id;
    });

    it('should get a specific agreement by id', async () => {
      const res = await request(app)
        .get(`/api/agreements/${agreementId}`)
        .set('Authorization', `Bearer ${labToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', agreementId);
    });
  });

  describe('PUT /api/agreements/:id/status', () => {
    let agreementId;

    beforeAll(async () => {
        const res = await request(app)
        .post('/api/agreements')
        .set('Authorization', `Bearer ${labToken}`)
        .send({
          applicationId,
          terms: 'Agreement to be updated',
          totalAmount: 3000,
          commissionRate: 0.2,
        });
        agreementId = res.body.id;
    });

    it('should update the status of an agreement', async () => {
      const res = await request(app)
        .put(`/api/agreements/${agreementId}/status`)
        .set('Authorization', `Bearer ${workerToken}`)
        .send({ status: 'active' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'active');
    });
  });
});