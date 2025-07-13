-- Migration to add unique constraint for connections table
-- Ensures only one connection per user pair (order-independent)

CREATE UNIQUE INDEX IF NOT EXISTS unique_connection_pair ON connections (
    LEAST(user_one_id, user_two_id),
    GREATEST(user_one_id, user_two_id)
);
