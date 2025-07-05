# LabLeap v9

## Overview

This repository contains the source code for the LabLeap v9 project, a marketplace platform designed to connect labs, scientists, and service providers in the biotech industry.

## Current Status

The project is currently in a **pre-beta** stage. The core "Connect" workflow, which allows labs and scientists to connect, is feature-complete. However, there is a critical bug preventing user registration and login.

For a complete and detailed overview of the project's status, roadmap, and technical architecture, please see the [**Comprehensive Status & Roadmap**](COMPREHENSIVE_STATUS_AND_ROADMAP.md) and the [**Handoff Document**](Handoff-July5-2025-1247.md) for the latest updates on the authentication bug.

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
