-- Migration to add verification fields to the user_documents table
-- This enhances the table to support integration with third-party credential verification services.
-- This migration uses T-SQL (SQL Server) syntax to match the existing database.

-- Rename the primary key column from document_id to id for consistency.
EXEC sp_rename 'user_documents.document_id', 'id', 'COLUMN';
GO

-- Add the new columns for verification tracking.
ALTER TABLE user_documents
ADD verification_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    verification_provider_id VARCHAR(255) NULL,
    verified_at DATETIMEOFFSET NULL;
GO

-- Add a check constraint for the verification_status column.
ALTER TABLE user_documents
ADD CONSTRAINT chk_verification_status CHECK (verification_status IN ('pending', 'verified', 'rejected'));
GO

-- Add an index on the verification_status to allow for efficient querying of documents.
CREATE INDEX idx_user_documents_verification_status ON user_documents(verification_status);
GO