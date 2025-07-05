# LabLeap v9

## Overview

This repository contains the source code for the LabLeap v9 project, a marketplace platform designed to connect labs, scientists, and service providers in the biotech industry.

## Current Status

The project is currently in **active development** with the following status:

✅ **Backend Authentication System: COMPLETED** (July 5, 2025)
- All authentication endpoints fully functional
- User registration working for all roles (Lab, Worker, Provider)
- Login system working with JWT tokens
- Database operations and validation working correctly

✅ **Profile System & Onboarding: COMPLETED** (July 5, 2025)
- Database migration applied with new profile fields
- Profile update API endpoints working and tested
- React onboarding component created with role-based flows
- Complete user management system ready for production

🔧 **Frontend Integration Testing: IN PROGRESS**
- Backend systems fully functional and tested
- Onboarding flow ready for final integration testing
- UI/UX polish needed for production readiness

For a complete and detailed overview of the project's status, roadmap, and technical architecture, please see the [**Project Status Summary**](PROJECT_STATUS_SUMMARY.md) and the latest [**Copilot Handoff Document**](COPILOT_HANDOFF_2025-07-05.md).

## Getting Started

To run the application locally, follow these steps:

1.  **Install Dependencies:**
    *   `cd backend && npm install`
    *   `npm install` (for the root `package.json` which contains `concurrently`)
2.  **Configure Environment:**
    *   Create a `.env` file in the `backend` directory and populate it with the necessary environment variables (see `.env.example`).
3.  **Run Migrations:**
    *   `cd backend && npm run migrate`
4.  **Start the Application:**
    *   In the root directory, run `npm run dev` to start both the frontend and backend servers concurrently.
