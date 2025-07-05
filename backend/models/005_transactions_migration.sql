-- Migration for creating the transactions table
-- This table records all financial movements within the platform.

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    agreement_id INTEGER NOT NULL REFERENCES agreements(id) ON DELETE CASCADE,
    from_user_id INTEGER NOT NULL REFERENCES users(id),
    to_user_id INTEGER NOT NULL REFERENCES users(id),
    transaction_type VARCHAR(255) NOT NULL CHECK (transaction_type IN ('payment', 'payout', 'commission', 'refund')),
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    payment_gateway_id VARCHAR(255), -- To store the ID from a payment provider like Stripe
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes on foreign keys for performance
CREATE INDEX idx_transactions_agreement_id ON transactions(agreement_id);
CREATE INDEX idx_transactions_from_user_id ON transactions(from_user_id);
CREATE INDEX idx_transactions_to_user_id ON transactions(to_user_id);

-- Add an index on transaction_type for filtering by type of transaction.
CREATE INDEX idx_transactions_transaction_type ON transactions(transaction_type);