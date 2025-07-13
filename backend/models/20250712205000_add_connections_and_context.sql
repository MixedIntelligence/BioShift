-- Migration to create the connections table and add context to conversations (Linter-Safe Version)

-- Create the connections table to track professional relationships
CREATE TABLE IF NOT EXISTS connections (
    id SERIAL PRIMARY KEY,
    user_one_id INTEGER NOT NULL,
    user_two_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_one_id) REFERENCES users(id),
    FOREIGN KEY (user_two_id) REFERENCES users(id)
);

-- Add context columns to the conversations table
ALTER TABLE conversations ADD context_gig_id INTEGER;
ALTER TABLE conversations ADD context_offering_id INTEGER;

-- Add an index for faster lookups on the connections table
CREATE INDEX idx_connections_user_one_id ON connections(user_one_id);
CREATE INDEX idx_connections_user_two_id ON connections(user_two_id);
