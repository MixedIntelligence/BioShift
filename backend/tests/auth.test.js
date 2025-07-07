const request = require('supertest');
const app = require('../index'); // Import the Express app

describe('Auth Endpoints', () => {
  /**
   * @description This test verifies that the POST /api/auth/register endpoint
   * works correctly after fixing the database compatibility bug. It sends a
   * valid registration request and asserts that the server responds with a 201
   * "Created" status.
   */
  it('should return 201 on POST /api/auth/register after fixing the bug', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: `testuser_${Date.now()}@example.com`,
        password: 'password123'
      });
    
    // We expect the registration to be successful.
    // This assertion will pass if the bug is fixed.
    expect(response.status).toBe(201);
  });
});
