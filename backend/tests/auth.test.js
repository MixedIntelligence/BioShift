const request = require('supertest');
const express = require('express');
const app = require('../index'); // Adjust if your app export is different
const db = require('../models/db');

describe('Auth API', () => {
  afterAll(() => {
    db.close();
  });
  it('should reject invalid registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: '', password: '' });
    expect(res.statusCode).toBe(400);
  });
  // Add more tests for registration, login, etc.
});
