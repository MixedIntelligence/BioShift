# BioShift LabLeap – Clickable MVP Demo

## Overview
LabLeap is a modern, agentic gig marketplace for science, built by BioShift. This clickable MVP demonstrates the core user flows, agentic AI (Bionics) layer, and integrations dashboard, all using mock data and a modern, eCommerce-inspired UI/UX. The project is fully dockerized for easy local and cloud deployment.

## Features
- Two-sided gig marketplace (labs & professionals)
- Profile, dashboard, and gig management flows
- Payments, history, upskill, and document management
- BioShift Connect integrations (cloud, chat, productivity, LLMs)
- LabLeap Bionics agentic AI layer (recommendations, chat, compliance, upskilling)
- Modern, responsive UI/UX

## Quick Start

### Local Development
```sh
yarn install
yarn start
```

### Docker
```sh
docker build -t biolab-leap .
docker run -p 3000:3000 biolab-leap
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `src/pages/profile/` – Profile subpages (Payments, History, Upskill, etc.)
- `src/pages/connect/` – Integrations dashboard
- `src/components/Layout/` – Main layout, sidebar, and routing
- `src/mockUsers.js` – Example mock data
- `Dockerfile`, `.dockerignore` – Containerization support
- `docs/` – PRD, Roadmap, Developer Brief, Handoff, Savepoint

## Next Steps
- Finalize UI/UX polish for clickable demo
- Begin backend/API development (see PRD and Roadmap)

## Documentation
- PRD: `docs/PRD_2025.md`
- Roadmap: `docs/ROADMAP_2025-07-02.md`
- Developer Brief: `docs/DEVELOPER_BRIEF_2025.md`
- Handoff: `docs/HANDOFF_UPDATED_2025-07-02.md`
- Savepoint: `docs/SAVEPOINT_2025-07-02.md`

---

© 2025 BioShift. LabLeap™ is a trademark of BioShift.

