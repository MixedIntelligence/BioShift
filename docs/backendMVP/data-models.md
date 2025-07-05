# LabLeap/BioShift Data Models (Conceptual)

This document provides conceptual data models for the backend, including user, gig, payment, and Bionics/NANDA entities.

---

## User
- id: string (UUID)
- name: string
- email: string
- role: enum (worker, lab, provider, admin)
- profile: object (details, history, upskill, etc.)

## Gig/Project
- id: string
- title: string
- description: string
- labId: string
- applicants: [userId]
- status: enum (open, in_progress, completed)
- createdAt, updatedAt: datetime

## Payment/Transaction
- id: string
- userId: string
- amount: number
- type: enum (payout, deposit, refund)
- status: enum (pending, completed, failed)
- createdAt: datetime

## Bionics/AI Action
- id: string
- userId: string
- context: object
- actionType: string
- result: object
- createdAt: datetime

## NANDA Reasoning
- id: string
- userId: string
- context: object (clinical/biomedical)
- nandaDiagnosis: string
- suggestedInterventions: [string]
- documentationTemplate: string
- createdAt: datetime

---

See `architecture.md` and `bionics-nanda.md` for usage context.
