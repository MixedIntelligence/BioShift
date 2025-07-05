CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    gig_id INTEGER NOT NULL REFERENCES gigs(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    accepted_at TIMESTAMP,
    UNIQUE(gig_id, user_id)
);