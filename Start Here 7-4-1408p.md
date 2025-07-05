# Start Here: LabLeap v9 Handoff (2025-07-04 14:08)

This document provides a quick starting point for the development team taking over the LabLeap v9 project.

## 1. Current Status

The application is feature-complete for the closed beta. All core user flows are implemented and connected to the backend API. The application is stable and runnable.

**Key Documents to Review:**
*   `HANDOFF_DOCUMENT.md`: A detailed overview of the project's architecture, features, and current state.
*   `CHECKPOINT_2025-07-04.md`: A snapshot of the project's status as of this handoff.
*   `PAYMENTS_IMPLEMENTATION_PLAN.md`: The plan for the next phase of development.

## 2. Immediate Next Steps

The immediate focus is to begin the **"Banking & Payouts"** epic.

1.  **Run Database Migrations:** The `bank_accounts` table needs to be added to the database. The migration script has been created but not yet run.
    *   **Action:** Run `node backend/models/run_migrations.js` to update the database schema.

2.  **Implement Banking & Payouts:** Begin implementing the tasks outlined in the `PAYMENTS_IMPLEMENTATION_PLAN.md` for the "Banking & Payouts" epic.

## 3. How to Run the Application

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run the Backend Server:**
    ```bash
    npm run server
    ```
3.  **Run the Frontend Development Server:**
    ```bash
    npm start
    ```

The application will be available at `http://localhost:3000`.