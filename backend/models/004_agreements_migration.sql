-- Migration for creating the agreements table
-- This table formalizes the relationship between a lab and a worker after an application is accepted.

CREATE TABLE agreements (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    gig_id INTEGER NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
    lab_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    worker_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(255) NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'active', 'completed', 'terminated')),
    terms TEXT,
    total_amount NUMERIC(10, 2) NOT NULL,
    commission_rate NUMERIC(3, 2) NOT NULL,
    commission_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Add an index on status for faster querying of agreements by their state.
CREATE INDEX idx_agreements_status ON agreements(status);

-- Add indexes on foreign keys for performance
CREATE INDEX idx_agreements_application_id ON agreements(application_id);
CREATE INDEX idx_agreements_gig_id ON agreements(gig_id);
CREATE INDEX idx_agreements_lab_id ON agreements(lab_id);
CREATE INDEX idx_agreements_worker_id ON agreements(worker_id);