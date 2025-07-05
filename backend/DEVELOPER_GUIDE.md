# Developer Guide: LabLeap/BioShift Backend

## Overview
This backend powers the LabLeap/BioShift gig marketplace and user management system. It is built with Node.js/Express, uses JWT authentication, and is designed for robust, secure, and scalable operation.

## Key Concepts
- **API Base Path:** `/api`
- **Authentication:** JWT (see `/backend/middleware/auth.js`)
- **Roles:** Admin, Lab, Worker, Provider (see `/backend/middleware/requireRole.js`)
- **Database:** SQLite for local dev (see `/backend/models/db.js`)
- **Audit Logging:** File-based, for sensitive actions (see `/backend/middleware/auditLog.js`)
- **Validation:** Joi schemas for input validation

## Local Development
1. Install dependencies: `npm install`
2. Run DB migrations: `node migrate.js`
3. Start server: `npm start`
4. Run tests: `npm test`

## Testing
- Tests are in `/backend/tests/` and use Jest + Supertest
- Add tests for new endpoints and features

## Adding Features
- Add new routes in `/backend/routes/`
- Add/modify models in `/backend/models/`
- Use middleware for auth, roles, and logging
- Validate all input with Joi
- Update audit logging for sensitive actions
- Write tests for new code

## API Docs
- (Planned) OpenAPI/Swagger or markdown docs
- For now, see route files for endpoint details

## Deployment
- Local: SQLite, `npm start`
- Production: Update models for PostgreSQL, configure environment, use secure secrets

## Contributing
- Fork, branch, PR workflow
- Write tests and docs for new features
- Follow RESTful and security best practices

## Next Steps
- Expand validation, logging, and tests
- Document all endpoints
- Implement Bionics/AI and integrations
- Prepare for production deployment

---
For more, see `README.md` and `changelog.md`.
