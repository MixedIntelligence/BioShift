-- Migration for BioShift Connect Provider Platform

-- Add Provider role to the user roles
-- Assuming 'user_role' is a custom enum type. If not, the ALTER TABLE statement for users.role might need adjustment.
-- For this implementation, we will assume a simple TEXT field for role and the application logic will enforce values.
-- If a user_role enum exists, the following command would be more appropriate:
-- ALTER TYPE user_role ADD VALUE 'Provider';

-- Table: providers
CREATE TABLE IF NOT EXISTS providers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: provider_applications
CREATE TABLE IF NOT EXISTS provider_applications (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    client_secret VARCHAR(255) UNIQUE NOT NULL,
    redirect_uri VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: user_connections
CREATE TABLE IF NOT EXISTS user_connections (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id INTEGER NOT NULL REFERENCES provider_applications(id) ON DELETE CASCADE,
    access_token VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add an index on user_id and application_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_connections_user_id_application_id ON user_connections(user_id, application_id);