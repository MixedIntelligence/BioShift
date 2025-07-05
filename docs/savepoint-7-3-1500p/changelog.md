# LabLeap/BioShift Backend Changelog

## [2025-07-03] Checkpoint

- Switched DB from PostgreSQL to SQLite for local dev; updated all models and migrations
- Added `role` column to users and enforced role-based access in routes
- Implemented all gig marketplace endpoints per API spec, including application tracking
- Added input validation with `joi` for auth and gig endpoints
- Added audit logging for registration, login, gig edit/delete/apply
- Scaffolded Jest/Supertest test structure
- Updated `.env` and documentation to reflect new setup
- Installed all necessary dependencies (`express`, `better-sqlite3`, `joi`, `jest`, `supertest`, etc.)

## Pending/Next Steps

- Expand input validation and error handling for all endpoints
- Expand audit logging coverage and review log format
- Write comprehensive unit/integration tests for users, gigs, applications
- Document all API endpoints (OpenAPI/Swagger or markdown)
- Implement Bionics/AI (NANDA) and integrations endpoints
- Add pagination/filtering, security hardening, and production deployment setup

---
For a full history, see commit logs or previous changelog entries.
