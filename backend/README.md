# LabLeap/BioShift Backend

## Project Overview
This is the Node.js/Express backend for the LabLeap/BioShift platform, supporting a gig marketplace, user management, authentication, payments (Stripe-ready), Bionics/AI endpoints, and integrations. The backend is designed to be robust, secure, and compatible with the frontend API expectations.

- **API Base Path:** `/api`
- **Authentication:** JWT-based
- **Database:** SQLite (for local dev; PostgreSQL planned for production)
- **Roles:** Admin, Lab, Worker, Provider
- **Key Features:**
  - User registration/login, role management
  - Gig/project CRUD and application tracking
  - Role-based access control
  - Audit logging for sensitive actions
  - Input validation with Joi
  - Stripe-ready payment endpoints (scaffolded)
  - Jest/Supertest for testing

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run database migrations:**
   ```sh
   node migrate.js
   ```

3. **Start the server:**
   ```sh
   npm start
   ```

4. **Run tests:**
   ```sh
   npm test
   ```

## Directory Structure

- `/backend/index.js` - Express app entry
- `/backend/models/` - Database models (SQLite)
- `/backend/routes/` - API route handlers
- `/backend/middleware/` - Auth, role, and logging middleware
- `/backend/tests/` - Jest/Supertest tests
- `/backend/migrate.js` - DB migrations
- `/backend/.env` - Environment variables

## API Documentation

- All endpoints are under `/api`.
- See `/backend/routes/` for route definitions.
- (Planned) OpenAPI/Swagger or markdown API docs.

## Development Notes

- Use SQLite for local development. For production, update models for PostgreSQL.
- Follow RESTful API and security best practices.
- Use role-based middleware to protect sensitive endpoints.
- Audit logs are written to file for sensitive actions.
- Input validation is enforced on all major endpoints.

## Next Steps

- [x] Fix critical authentication bug preventing user registration and login
- [ ] Expand input validation and error handling for all endpoints
- [ ] Expand audit logging coverage and review log format
- [ ] Write comprehensive unit/integration tests for users, gigs, applications
- [ ] Document all API endpoints (OpenAPI/Swagger or markdown)
- [ ] Implement Bionics/AI (NANDA) and integrations endpoints
- [ ] Add pagination/filtering, security hardening, and production deployment setup

## Contributing

- Fork and clone the repo
- Create feature branches for new work
- Write tests for new features
- Run `npm test` before submitting PRs
- Follow code style and best practices

## Helpful Resources

- [Express.js Documentation](https://expressjs.com/)
- [Joi Validation](https://joi.dev/)
- [JWT Guide](https://jwt.io/introduction)
- [Supertest](https://github.com/visionmedia/supertest)
- [Jest](https://jestjs.io/)

---
For questions or issues, please contact the project maintainer or open an issue.
