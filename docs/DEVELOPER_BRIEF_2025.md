# LabLeap Developer Brief – July 2025

## Project Overview

LabLeap is a modern, agentic gig marketplace for science, built as a React clickable MVP demo. The current phase is frontend-only, using mock data and focusing on UI/UX polish and agentic AI (Bionics) flows. Backend/API development will begin in the next phase.

## Onboarding Steps

1. **Clone the Repo:**
   - `git clone <repo-url>`
   - `cd sing-app-react`

2. **Install Dependencies:**
   - `yarn install`

3. **Run the App Locally:**
   - `yarn start` (for development)
   - Or use Docker:
     - `docker build -t biolab-leap .`
     - `docker run -p 3000:3000 biolab-leap`

4. **Explore the Demo:**
   - All navigation, profile subpages, and integrations are clickable and use mock data.
   - Bionics agentic layer is visible on the Bionics page and dashboard.

5. **Code Structure:**
   - `src/pages/profile/` – Profile subpages (Payments, History, Upskill, etc.)
   - `src/pages/connect/` – Integrations dashboard
   - `src/components/Layout/` – Main layout, sidebar, and routing
   - `src/mockUsers.js` – Example mock data

6. **UI/UX Polish:**
   - Focus on consistent, modern design using eCommerce and dashboard components.
   - All routes and sidebar links should be functional.
   - Sidebar Projects section now features BioShift/Gig Marketplace projects with progress and relevant text.
   - Dashboards (Lab, Worker, Provider) modernized and polished with analytics/admin components and BioShift-specific content.

7. **Docker & Deployment:**
   - The app is fully dockerized for local and cloud deployment.
   - Use the provided `Dockerfile` and `.dockerignore` for reproducible builds.

## Next Steps

- Finalize UI/UX polish for clickable demo.
- Prepare for backend/API development (see PRD and Roadmap).
- Review handoff doc for further instructions.

## Resources

- PRD: `docs/PRD_2025.md`
- Roadmap: `docs/ROADMAP_2025-07-02.md`
- Handoff: `docs/HANDOFF_UPDATED_2025-07-02.md`
- Savepoint: `docs/SAVEPOINT_2025-07-02.md`

For questions, contact the BioShift team or see the README for more details.
