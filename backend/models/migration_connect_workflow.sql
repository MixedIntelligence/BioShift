DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'applications') THEN
        CREATE TABLE applications (
            id SERIAL PRIMARY KEY,
            gig_id INTEGER NOT NULL REFERENCES gigs(id),
            user_id INTEGER NOT NULL REFERENCES users(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(gig_id, user_id)
        );
    END IF;
END$$;

ALTER TABLE applications
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE;