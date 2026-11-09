CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('organization','professional')),
  full_name TEXT NOT NULL,
  organization_name TEXT,
  headline TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  stripe_account_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discipline TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Remote',
  work_mode TEXT NOT NULL DEFAULT 'Remote',
  hourly_rate_cents INTEGER NOT NULL CHECK (hourly_rate_cents > 0),
  estimated_hours INTEGER NOT NULL DEFAULT 1 CHECK (estimated_hours > 0),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','completed','cancelled')),
  skills TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES gigs(id),
  professional_id UUID NOT NULL REFERENCES users(id),
  cover_note TEXT NOT NULL DEFAULT '',
  proposed_rate_cents INTEGER,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','shortlisted','offered','hired','declined','withdrawn')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(gig_id, professional_id)
);

CREATE TABLE IF NOT EXISTS engagements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES gigs(id),
  application_id UUID NOT NULL UNIQUE REFERENCES applications(id),
  organization_id UUID NOT NULL REFERENCES users(id),
  professional_id UUID NOT NULL REFERENCES users(id),
  agreed_total_cents INTEGER NOT NULL CHECK (agreed_total_cents > 0),
  status TEXT NOT NULL DEFAULT 'offered' CHECK (status IN ('offered','active','awaiting_review','completed','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','in_progress','submitted','approved','paid')),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL UNIQUE REFERENCES milestones(id),
  engagement_id UUID NOT NULL REFERENCES engagements(id),
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  provider TEXT NOT NULL DEFAULT 'demo',
  provider_payment_id TEXT,
  provider_transfer_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','paid_demo','paid','failed','refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gigs_status_created_idx ON gigs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS applications_gig_idx ON applications(gig_id, created_at DESC);
CREATE INDEX IF NOT EXISTS engagements_professional_idx ON engagements(professional_id, created_at DESC);
CREATE INDEX IF NOT EXISTS milestones_engagement_idx ON milestones(engagement_id, created_at);
