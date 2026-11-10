# BioShift MVP

A fresh, isolated implementation of the BioShift STEM gig marketplace. This lives in `/mvp` and does not replace the legacy BioShiftv9 application.

## Product slice

- **Organizations** register, post specialized STEM gigs, review applications, and issue offers.
- **Professionals** register, discover opportunities, apply, and manage engagements.
- **Offers** require explicit acceptance or decline by the professional.
- **Engagements** contain three milestone deliverables (25/50/25 of the agreed amount).
- **Milestones** move through upcoming → in progress → submitted → approved.
- **Approvals** create demo payment-ledger records; no real money moves.
- The engagement and gig are marked completed after all milestones are approved.

## Stack

- React 18 + TypeScript + Vite
- Express API + PostgreSQL
- JWT sessions + bcrypt password hashing
- Zod request validation

## Local setup

Requirements: Node.js 20+ and PostgreSQL.

```bash
cd mvp
npm install
cp .env.example .env
```

Set `DATABASE_URL` and a long random `JWT_SECRET` in `.env`, then initialize the database:

```bash
psql "$DATABASE_URL" -f server/schema.sql
npm run dev
```

The web app runs at http://localhost:5173 and the API at http://localhost:4000. Vite proxies `/api` requests to the local API. API health check: http://localhost:4000/api/health.

To run either process separately, use `npm run dev:web` or `npm run dev:api`.

## Transaction lifecycle

1. Organization publishes an open gig.
2. Professional applies once per gig.
3. Organization issues an offer. The API creates a pending engagement and a 25/50/25 milestone plan in one database transaction.
4. Professional explicitly accepts or declines. Only acceptance activates the engagement and moves the gig to in progress.
5. Professional starts and submits milestones.
6. Organization approves submitted work.
7. Each approval creates a `paid_demo` ledger entry. It is not a real payment or transfer.
8. The engagement and gig are marked completed when all milestones are approved.

## Continuous integration

GitHub Actions provisions PostgreSQL and runs an end-to-end transaction test covering registration, gig search, application, offer, acceptance, milestone delivery, demo ledger entries, completion, and offer decline. CI also checks API syntax and builds the frontend.

Run the integration test locally with `npm run test:integration` after setting `DATABASE_URL` to a disposable test database. The test drops and recreates that database's public schema; never point it at a database containing data you need.

## Deployment

For Vercel, set the project Root Directory to `mvp`. The `mvp/vercel.json` configuration builds the Vite app from that directory. Leave the repository-root Vercel configuration untouched because it belongs to the legacy app.

When frontend and API are deployed separately:
- Set `VITE_API_URL` to the API origin at frontend build time.
- Set `CLIENT_ORIGIN` to the exact frontend origin on the API.
- Configure HTTPS and a production-grade PostgreSQL database.

## Payments and production boundaries

The demo does not collect, hold, or transfer real funds. A production marketplace payment flow requires Stripe Connect onboarding, payment collection, verified webhooks, refunds/disputes handling, transfer controls, and legal/accounting review. Do not enable real payments until the complete flow and obligations have been reviewed.

Not yet included: account recovery, production-grade identity controls, file storage, chat, e-signatures, KYC/credential verification, live Stripe Connect transfers, tax reporting, dispute handling, automated matching, rate limiting, audit logging, and production observability.

## Security notes

- Set a unique, high-entropy `JWT_SECRET` in every non-local environment.
- Configure strict CORS, request rate limits, audit logging, backups, and secret management before public deployment.
- Never store bank account or card details in BioShift.
- The app is an early MVP, not a production identity or payment environment.
