# LabLeap v9 Handoff Document

**Date:** 2025-07-04

**Author:** Roo

## 1. Current Status

This document marks the handoff of the LabLeap v9 MVP, which is now feature-complete for the closed beta test. All core epics outlined in the `BETA_IMPLEMENTATION_PLAN.md` have been implemented, including the "Connect" workflow, document management, notification system, and data privacy rules.

The application is in a stable, runnable state. The frontend is connected to the backend, and all user flows are functional.

## 2. Key Architectural Concepts

*   **Stack:** React (v18), Node.js (Express), Redux, SQLite.
*   **Architecture:** A standard client-server model with a RESTful API.
*   **Authentication:** JWT-based authentication is handled by the `authenticateToken` middleware.
*   **Authorization:** Role-based access control is enforced by the `requireRole` middleware.
*   **Database:** SQLite is used for the database, with migrations managed by the `run_migrations.js` script.
*   **API Service:** A centralized API service in `src/services/api.js` is used for all frontend API calls.

## 3. Next Steps: Payments & Banking

The next phase of development will focus on implementing the "Payments & Banking" features, as detailed in the `PAYMENTS_IMPLEMENTATION_PLAN.md`. This will involve integrating Stripe for payment processing and building out the necessary UI and backend logic for managing bank accounts and payouts.

The initial setup for the Stripe integration has been completed using the Stripe MCP tool, including the creation of a customer, product, price, and payment link. The immediate next step is to integrate this payment link into the frontend.

## 4. Key Files for Next Phase

*   `PAYMENTS_IMPLEMENTATION_PLAN.md`: The plan for the next phase of development.
*   `src/pages/offerings/Offerings.js`: The page where the "Subscribe to LabLeap Pro" button has been added.
*   `backend/models/004_bank_accounts_migration.sql`: The migration for the `bank_accounts` table.
*   `backend/models/000_master_migration.sql`: The master migration file.
*   `backend/models/run_migrations.js`: The script for running database migrations.