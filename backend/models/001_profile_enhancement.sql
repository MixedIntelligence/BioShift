-- Profile Enhancement Migration
-- Adds additional profile fields to users table

-- Add new columns to users table for enhanced profile data
ALTER TABLE users ADD COLUMN first_name TEXT;
ALTER TABLE users ADD COLUMN last_name TEXT;
ALTER TABLE users ADD COLUMN username TEXT;
ALTER TABLE users ADD COLUMN headline TEXT;
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN location TEXT;
ALTER TABLE users ADD COLUMN onboarding_completed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN profile_completed INTEGER DEFAULT 0;

-- Add company-specific fields for providers (can be null for other roles)
ALTER TABLE users ADD COLUMN company_description TEXT;

-- Add lab-specific fields for labs (can be null for other roles)  
ALTER TABLE users ADD COLUMN lab_description TEXT;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_onboarding ON users(onboarding_completed);

-- Update existing users to have profile completion status
UPDATE users SET onboarding_completed = 0, profile_completed = 0 WHERE onboarding_completed IS NULL;
