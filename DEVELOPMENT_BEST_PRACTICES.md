# Development Best Practices - BioMVP v9

## Code Organization and Structure

### Frontend (React) Best Practices

#### Component Structure
```javascript
// Recommended component structure
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import api from '../services/api';

const ComponentName = ({ currentUser, ...props }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getData();
      setData(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

ComponentName.propTypes = {
  currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(ComponentName);
```

#### Error Handling Patterns
```javascript
// Always wrap API calls in try-catch
const handleSubmit = async (formData) => {
  try {
    setSubmitting(true);
    const response = await api.submitData(formData);
    // Handle success
    setData(response.data);
    setMessage('Success!');
  } catch (error) {
    // Handle specific error types
    if (error.response?.status === 401) {
      // Handle authentication error
      dispatch(logout());
    } else if (error.response?.status === 400) {
      // Handle validation error
      setFieldErrors(error.response.data.errors);
    } else {
      // Handle generic error
      setError('An unexpected error occurred');
    }
    console.error('Submission error:', error);
  } finally {
    setSubmitting(false);
  }
};
```

#### State Management Guidelines
- Use Redux for global state (user auth, app-wide settings)
- Use local state for component-specific data
- Keep state minimal and normalized
- Use async actions for API calls

### Backend (Node.js/Express) Best Practices

#### Route Structure
```javascript
// routes/resourceName.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const resourceController = require('../controllers/resourceController');

// GET /api/resource - List resources
router.get('/', auth, resourceController.list);

// GET /api/resource/:id - Get specific resource
router.get('/:id', auth, resourceController.get);

// POST /api/resource - Create resource
router.post('/', auth, validate('createResource'), resourceController.create);

// PUT /api/resource/:id - Update resource
router.put('/:id', auth, validate('updateResource'), resourceController.update);

// DELETE /api/resource/:id - Delete resource
router.delete('/:id', auth, resourceController.delete);

module.exports = router;
```

#### Controller Pattern
```javascript
// controllers/resourceController.js
const resourceModel = require('../models/resource');

const list = async (req, res) => {
  try {
    const resources = await resourceModel.getUserResources(req.user.id);
    res.json(resources);
  } catch (error) {
    console.error('Error listing resources:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const create = async (req, res) => {
  try {
    const resource = await resourceModel.createResource(req.user.id, req.body);
    res.status(201).json(resource);
  } catch (error) {
    if (error.code === 'UNIQUE_CONSTRAINT') {
      return res.status(400).json({ error: 'Resource already exists' });
    }
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { list, create };
```

#### Database Model Pattern
```javascript
// models/resource.js
const db = require('./db');

const getUserResources = (userId) => {
  return db.prepare('SELECT * FROM resources WHERE user_id = ?').all(userId);
};

const createResource = (userId, resourceData) => {
  const { name, description } = resourceData;
  const stmt = db.prepare(
    'INSERT INTO resources (user_id, name, description) VALUES (?, ?, ?)'
  );
  const result = stmt.run(userId, name, description);
  return { id: result.lastInsertRowid, name, description };
};

const findById = (id) => {
  return db.prepare('SELECT * FROM resources WHERE id = ?').get(id);
};

module.exports = {
  getUserResources,
  createResource,
  findById,
};
```

## API Design Guidelines

### RESTful Endpoint Conventions
```
GET    /api/resources          - List all resources
GET    /api/resources/:id      - Get specific resource
POST   /api/resources          - Create new resource
PUT    /api/resources/:id      - Update entire resource
PATCH  /api/resources/:id      - Partial update resource
DELETE /api/resources/:id      - Delete resource

GET    /api/users/me/resources - Get current user's resources
POST   /api/users/me/resources - Create resource for current user
```

### Response Format Standards
```javascript
// Success responses
{
  "data": [...],
  "message": "Success message (optional)",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}

// Error responses
{
  "error": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE",
  "details": {
    "field": "validation error"
  }
}
```

### Status Code Usage
- **200 OK** - Successful GET, PUT, PATCH
- **201 Created** - Successful POST
- **204 No Content** - Successful DELETE
- **400 Bad Request** - Validation errors
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server errors

## Security Best Practices

### Authentication and Authorization
```javascript
// Always validate JWT tokens
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Check resource ownership
const checkOwnership = async (req, res, next) => {
  try {
    const resource = await resourceModel.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    if (resource.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    req.resource = resource;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

### Input Validation
```javascript
// Use validation middleware
const { body, validationResult } = require('express-validator');

const validateUser = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['User', 'Lab', 'Provider']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];
```

### Environment Variables
```javascript
// Required environment variables
const requiredEnvVars = [
  'JWT_SECRET',
  'DB_PATH',
  'NODE_ENV',
  'PORT'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});
```

## Testing Guidelines

### Unit Testing (Jest)
```javascript
// Component testing
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import Skills from './Skills';
import { store } from '../store';

describe('Skills Component', () => {
  it('should load and display skills', async () => {
    render(
      <Provider store={store}>
        <Skills />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('My Skills')).toBeInTheDocument();
    });
  });

  it('should add a new skill', async () => {
    render(
      <Provider store={store}>
        <Skills />
      </Provider>
    );

    const input = screen.getByLabelText('Skill');
    const button = screen.getByText('Add Skill');

    fireEvent.change(input, { target: { value: 'JavaScript' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });
  });
});
```

### API Testing
```javascript
// Backend route testing
const request = require('supertest');
const app = require('../app');

describe('POST /api/users/me/skills', () => {
  let authToken;

  beforeEach(async () => {
    // Setup test user and get auth token
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'testpass' });
    authToken = response.body.token;
  });

  it('should add a new skill', async () => {
    const response = await request(app)
      .post('/api/users/me/skills')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ upskill: 'JavaScript' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Upskill added');
  });

  it('should require authentication', async () => {
    const response = await request(app)
      .post('/api/users/me/skills')
      .send({ upskill: 'JavaScript' });

    expect(response.status).toBe(401);
  });
});
```

## Performance Guidelines

### Frontend Optimization
- Use React.memo for expensive components
- Implement lazy loading for routes and components
- Optimize bundle size with code splitting
- Use proper key props in lists
- Debounce user input for search/filter

### Backend Optimization
- Use database indexes on frequently queried columns
- Implement connection pooling
- Add response caching where appropriate
- Use compression middleware
- Implement rate limiting

### Database Best Practices
```sql
-- Always use indexes on foreign keys
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_education_user_id ON user_education(user_id);

-- Use composite indexes for common query patterns
CREATE INDEX idx_users_email_role ON users(email, role);
```

## Debugging and Logging

### Frontend Debugging
```javascript
// Use proper console methods
console.error('Error:', error);
console.warn('Warning:', warning);
console.info('Info:', info);
console.debug('Debug:', debug);

// Use Redux DevTools
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```

### Backend Logging
```javascript
// Use structured logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log important events
logger.info('User logged in', { userId: user.id, email: user.email });
logger.error('Database error', { error: error.message, stack: error.stack });
```

## Code Review Checklist

### General
- [ ] Code follows project conventions
- [ ] No hardcoded values (use environment variables)
- [ ] Proper error handling implemented
- [ ] No console.log statements in production code
- [ ] Comments explain "why" not "what"

### Frontend
- [ ] Components are properly typed with PropTypes
- [ ] State management is appropriate (local vs global)
- [ ] Async operations have loading and error states
- [ ] Accessibility attributes are present
- [ ] No direct DOM manipulation

### Backend
- [ ] Authentication is properly implemented
- [ ] Input validation is comprehensive
- [ ] Database queries are optimized
- [ ] Proper HTTP status codes are used
- [ ] Sensitive data is not logged

### Security
- [ ] No secrets in code
- [ ] User input is validated and sanitized
- [ ] Authorization checks are in place
- [ ] SQL injection prevention
- [ ] XSS prevention

This document should be updated as the project evolves and new patterns are established.
