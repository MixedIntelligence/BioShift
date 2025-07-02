# LabLeap Clickable Demo Handoff

## Project Overview

This project is a local, backend-free clickable demo for a gig marketplace (LabLeap), built using the Sing App React template. It demonstrates core marketplace flows for labs and workers, including gig listings, details, posting, dashboards, and mock data interactions. The demo is designed for onboarding, stakeholder review, and handoff to future developers.

---

## Key Features

- **Gigs List, Details, and Posting**: Browse, view, and post gigs with seeded example data.
- **Dashboards**: Lab and Worker dashboards with working charts and stats, using proven analytics components.
- **Mock Data**: All data (gigs, users, applications) is seeded and handled locally for a backend-free experience.
- **Navigation**: Sidebar and routing updated to include all demo flows.
- **Documentation**: Clear onboarding, next steps, and handoff docs included in `/docs`.
- **Modern React**: Upgraded to React 18, with all dependencies updated and charting libraries fixed for compatibility.

---

## File/Folder Structure

- `src/pages/gigs/` — Gigs list, details, and post form pages, with mock data.
- `src/pages/dashboard/` — Lab and Worker dashboards, using analytics chart components and mock data.
- `src/pages/analytics/` — Proven chart components and mock data for dashboards.
- `src/components/Widget/` — Widget container used throughout dashboards and analytics.
- `src/pages/users/`, `src/pages/applications/` — Additional mock data and flows.
- `src/components/Layout/`, `src/components/Sidebar/` — Routing and navigation.
- `docs/` — Onboarding, handoff, and next steps documentation.

---

## How to Run the Demo

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the local dev server:**
   ```sh
   npm start
   ```
3. **Navigate the demo:**
   - Gigs: `/app/gigs`
   - Post a Gig: `/app/post-gig`
   - Lab Dashboard: `/app/dashboard/lab`
   - Worker Dashboard: `/app/dashboard/worker`
   - More flows via sidebar navigation

---

## Next Steps for Developers

- Expand demo flows (profile, admin, application management, etc.)
- Connect to a real backend or API as needed
- Polish UI/UX and add more realistic data
- Review `/docs/NEXT_STEPS_CLICKABLE_DEMO.md` for a step-by-step guide

---

## Contact & Support

For questions or further handoff, see the project owner or refer to the documentation in `/docs`.

---

*Generated July 2, 2025 — LabLeap Demo Handoff*
