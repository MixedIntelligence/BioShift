require('dotenv').config();
const request = require('supertest');
const app = require('../index');
const db = require('../models/db');
const providerModel = require('../models/provider');
const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock the provider model
jest.mock('../models/provider');

describe('Provider API', () => {
  let token;
  let providerId;
  let otherProviderId;

  beforeAll(async () => {
    // Create a test provider
    const hashedPassword = await bcrypt.hash('password123', 10);
    const provider = await userModel.createUser('testprovider', hashedPassword, 'Provider');
    providerId = provider.id;

    const otherProvider = await userModel.createUser('otherprovider', hashedPassword, 'Provider');
    otherProviderId = otherProvider.id;


    // Log in and get a token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testprovider',
        password: 'password123',
      });
    token = res.body.token;
  });

  afterAll(() => {
    db.close();
  });

  describe('POST /api/provider/applications', () => {
    it('should create a new application for the authenticated provider', async () => {
      const newApp = {
        name: 'Test App',
        description: 'A test application',
        redirect_uri: 'https://example.com/callback',
      };

      const mockCreatedApp = { id: 1, provider_id: providerId, ...newApp };
      providerModel.createApplication.mockResolvedValue(mockCreatedApp);

      const res = await request(app)
        .post('/api/provider/applications')
        .set('Authorization', `Bearer ${token}`)
        .send(newApp);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(newApp.name);
    });
  });

  describe('GET /api/provider/applications', () => {
    it('should get a list of applications for the authenticated provider', async () => {
      const mockApps = [
        { id: 1, name: 'App 1', provider_id: providerId },
        { id: 2, name: 'App 2', provider_id: providerId },
      ];
      providerModel.getApplicationsByProvider.mockResolvedValue(mockApps);

      const res = await request(app)
        .get('/api/provider/applications')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /api/provider/applications/:id', () => {
    it('should get an application by ID for the authenticated provider', async () => {
      const mockApp = { id: 1, name: 'Test App', provider_id: providerId };
      providerModel.getApplicationById.mockResolvedValue(mockApp);

      const res = await request(app)
        .get('/api/provider/applications/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toBe(1);
    });

    it('should return 404 if the application belongs to another provider', async () => {
      const mockApp = { id: 2, name: 'Other App', provider_id: otherProviderId };
      providerModel.getApplicationById.mockResolvedValue(mockApp);

      const res = await request(app)
        .get('/api/provider/applications/2')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PUT /api/provider/applications/:id', () => {
    it('should update an application by ID for the authenticated provider', async () => {
      const updatedApp = { name: 'Updated Test App' };
      const mockApp = { id: 1, name: 'Test App', provider_id: providerId };
      const mockUpdatedApp = { ...mockApp, ...updatedApp };

      providerModel.getApplicationById.mockResolvedValue(mockApp);
      providerModel.updateApplication.mockResolvedValue(mockUpdatedApp);

      const res = await request(app)
        .put('/api/provider/applications/1')
        .set('Authorization', `Bearer ${token}`)
        .send(updatedApp);

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe(updatedApp.name);
    });

    it('should return 404 if trying to update an application belonging to another provider', async () => {
        const updatedApp = { name: 'Updated Test App' };
        const mockApp = { id: 2, name: 'Other App', provider_id: otherProviderId };
  
        providerModel.getApplicationById.mockResolvedValue(mockApp);
  
        const res = await request(app)
          .put('/api/provider/applications/2')
          .set('Authorization', `Bearer ${token}`)
          .send(updatedApp);
  
        expect(res.statusCode).toEqual(404);
      });
  });

  describe('DELETE /api/provider/applications/:id', () => {
    it('should delete an application by ID for the authenticated provider', async () => {
      const mockApp = { id: 1, name: 'Test App', provider_id: providerId };
      providerModel.getApplicationById.mockResolvedValue(mockApp);
      providerModel.deleteApplication.mockResolvedValue(1);

      const res = await request(app)
        .delete('/api/provider/applications/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(204);
    });

    it('should return 404 if trying to delete an application belonging to another provider', async () => {
        const mockApp = { id: 2, name: 'Other App', provider_id: otherProviderId };
        providerModel.getApplicationById.mockResolvedValue(mockApp);
  
        const res = await request(app)
          .delete('/api/provider/applications/2')
          .set('Authorization', `Bearer ${token}`);
  
        expect(res.statusCode).toEqual(404);
      });
  });
});