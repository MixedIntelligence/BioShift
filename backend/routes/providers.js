const express = require('express');
const router = express.Router();
const providerModel = require('../models/provider');
const authenticateToken = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const { v4: uuidv4 } = require('uuid');

// POST /api/provider/applications - Create a new application
router.post('/applications', authenticateToken, requireRole('Provider'), async (req, res) => {
    const { name, description, redirect_uri } = req.body;
    const provider_id = req.user.id; // Assuming the user_id is the provider_id

    if (!name || !description || !redirect_uri) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const api_key = uuidv4();
        const client_secret = uuidv4();

        const app = await providerModel.createApplication({
            provider_id,
            name,
            description,
            api_key,
            client_secret,
            redirect_uri
        });

        res.status(201).json(app);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create application' });
    }
});

// GET /api/provider/applications - Get a list of applications for the authenticated provider
router.get('/applications', authenticateToken, requireRole('Provider'), async (req, res) => {
    const provider_id = req.user.id;

    try {
        const applications = await providerModel.getApplicationsByProvider(provider_id);
        res.json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve applications' });
    }
});

// GET /api/provider/applications/:id - Get details for a specific application
router.get('/applications/:id', authenticateToken, requireRole('Provider'), async (req, res) => {
    const { id } = req.params;
    const provider_id = req.user.id;

    try {
        const application = await providerModel.getApplicationById(id);

        if (!application || application.provider_id !== provider_id) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.json(application);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve application' });
    }
});

// PUT /api/provider/applications/:id - Update an application's details
router.put('/applications/:id', authenticateToken, requireRole('Provider'), async (req, res) => {
    const { id } = req.params;
    const provider_id = req.user.id;
    const { name, description, redirect_uri } = req.body;

    try {
        const application = await providerModel.getApplicationById(id);

        if (!application || application.provider_id !== provider_id) {
            return res.status(404).json({ error: 'Application not found' });
        }

        const updatedApp = await providerModel.updateApplication(id, {
            name,
            description,
            redirect_uri
        });

        res.json(updatedApp);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update application' });
    }
});

// DELETE /api/provider/applications/:id - Delete an application
router.delete('/applications/:id', authenticateToken, requireRole('Provider'), async (req, res) => {
    const { id } = req.params;
    const provider_id = req.user.id;

    try {
        const application = await providerModel.getApplicationById(id);

        if (!application || application.provider_id !== provider_id) {
            return res.status(404).json({ error: 'Application not found' });
        }

        await providerModel.deleteApplication(id);

        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete application' });
    }
});

module.exports = router;