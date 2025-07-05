-- Add profile fields to users table
-- This migration adds fields needed for user onboarding and profiles

ALTER TABLE users ADD first_name TEXT;
ALTER TABLE users ADD last_name TEXT;
ALTER TABLE users ADD phone TEXT;
ALTER TABLE users ADD bio TEXT;
ALTER TABLE users ADD location TEXT;
ALTER TABLE users ADD years_experience INTEGER;
ALTER TABLE users ADD current_position TEXT;
ALTER TABLE users ADD company_name TEXT;
ALTER TABLE users ADD website TEXT;
ALTER TABLE users ADD linkedin_url TEXT;
ALTER TABLE users ADD github_url TEXT;
ALTER TABLE users ADD profile_completed INTEGER DEFAULT 0;
ALTER TABLE users ADD onboarding_completed INTEGER DEFAULT 0;
