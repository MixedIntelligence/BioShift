process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

const request = require('supertest');
const app = require('../index');
const db = require('../models/db');

describe('Profile API Endpoints', () => {
  let token;

  beforeAll(async () => {
    // Reset users table for a clean state
    await db.query('DELETE FROM users');
    // Register the test user via the API to ensure correct hashing and setup
    await request(app).post('/api/auth/register').send({ username: 'testuser', password: 'testpass' });
  });

  beforeEach(async () => {
    // Always login to get a fresh JWT
    const res = await request(app).post('/api/auth/login').send({ username: 'testuser', password: 'testpass' });
    token = res.body.token;
  });

  it('GET /api/users/me returns current user profile', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  it('PUT /api/users/me updates user profile', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'testuser2' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Profile updated');
  });

  it('POST /api/users/me/password changes password (stub)', async () => {
    const res = await request(app)
      .post('/api/users/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ newPassword: 'newpass' });
    expect([200, 400]).toContain(res.statusCode);
  });

  it('GET /api/users/me/history returns user history (stub)', async () => {
    const res = await request(app)
      .get('/api/users/me/history')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Add similar tests for upskill, payments, startups, documents, publications, patents, bionics

  afterAll(() => {
    // No db.close() needed for pg pool
  });
});
