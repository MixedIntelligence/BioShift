-- Gigs table migration

CREATE TABLE IF NOT EXISTS gigs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration for existing table (standard Postgres)
ALTER TABLE gigs ADD COLUMN lab_info TEXT;
ALTER TABLE gigs ADD COLUMN faq TEXT;
