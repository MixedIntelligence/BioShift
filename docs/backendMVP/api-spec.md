# LabLeap/BioShift API Specification

This document defines the conceptual API for the LabLeap/BioShift backend, including endpoints for the Bionics/AI layer and NANDA integration.

---

## Authentication
- `POST /auth/login` — User login
- `POST /auth/register` — User registration
- `POST /auth/logout` — Logout
- `GET /auth/me` — Get current user profile

## Users
- `GET /users/:id` — Get user profile
- `PUT /users/:id` — Update user profile
- `GET /users/:id/history` — Get user activity/history

## Gigs/Projects
- `GET /gigs` — List gigs/projects
- `POST /gigs` — Create gig/project
- `GET /gigs/:id` — Gig/project details
- `POST /gigs/:id/apply` — Apply to gig

## Payments
- `GET /payments` — List transactions
- `POST /payments/payout` — Initiate payout
- `GET /payments/methods` — List payment methods

## Bionics/AI (with NANDA)
- `POST /bionics/agent` — Agentic action (input: context, task, user)
- `POST /bionics/nanda` — NANDA reasoning/suggestions (input: clinical/biomedical context)
- `GET /bionics/history` — Agentic action history

## Integrations
- `GET /integrations` — List available integrations
- `POST /integrations/connect` — Connect integration

---

See `bionics-nanda.md` for Bionics/AI and NANDA payloads and workflows.
