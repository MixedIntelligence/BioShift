# BioShift MVP

A fresh, isolated implementation of the BioShift STEM gig marketplace. This lives in `/mvp` and does not replace the legacy BioShiftv9 application.

## Product slice

The first release focuses on a complete hire-to-delivery transaction between two account types:

- **Organizations** post specialized STEM gigs, review applications, and issue offers.
- **Professionals** discover opportunities, apply, and manage active engagements.
- **Engagements** contain three milestone-based deliverables.
- **Approvals** create an auditable payment-ledger record.

The included React experience runs in **interactive demo mode** with sample data so the product can be explored without credentials or a database. The Express/PostgreSQL API is the next connected runtime path and includes registration, login, marketplace, applications, offers, milestones, and payment-ledger endpoints.

## Stack

- React 18 + TypeScript + Vite
- Express API
- PostgreSQL
- JWT sessions + bcrypt password hashing
- Zod request validation

## Run the demo

```bash
cd mvp
npm install
npm run dev:web
```

Open http://localhost:5173.

## Run the API

Create a PostgreSQL database, then:

```bash
cp .env.example .env
# Set DATABASE_URL and a long random JWT_SECRET
psql "$DATABASE_URL" -f server/schema.sql
npm install
npm run dev:api
```

API health check: http://localhost:4000/api/health

## Transaction model

1. Organization publishes an open gig with scope, discipline, location, hourly rate, and estimated hours.
2. Professional applies once per gig.
3. Organization issues an offer; the API creates a pending engagement and a 25/50/25 milestone plan in one database transaction.
4. Professional explicitly accepts the offer; only then does the engagement become active and the gig move to in progress.
5. Professional starts and submits each milestone.
6. Organization approves submitted work.
7. Approval creates a demo payment-ledger entry. In demo mode this is explicitly marked `paid_demo`; it is not a real payment or transfer.

## Payments are deliberately not represented as escrow

The demo does not collect, hold, or transfer real funds. A production marketplace payment flow requires Stripe Connect onboarding, payment collection, verified webhooks, refunds/disputes handling, transfer controls, and legal/accounting review. Stripe Connect's separate charges and transfers model can support a platform charging a buyer and transferring to a connected professional later; it does not make BioShift an escrow provider. Do not enable real payments until the complete flow and obligations have been reviewed.

## MVP boundaries

Included: two-sided marketplace, gig creation, applications, offers, engagements, milestone progression, approval, and payment ledger.

Not yet included: production authentication UI, file storage, chat, e-signatures, KYC/credential verification, live Stripe Connect transfers, tax reporting, dispute handling, and automated matching.

## Security notes

- Set a unique, high-entropy `JWT_SECRET` in every non-local environment.
- Configure HTTPS, strict CORS, request rate limits, audit logging, backups, and secret management before public deployment.
- Never store bank account or card details in BioShift.
- The demo UI uses browser local state only. It is not a production identity or payment environment.
