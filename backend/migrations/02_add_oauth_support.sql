-- Add OAuth support to users table
-- Make password nullable for OAuth users
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Add OAuth provider and ID columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_id TEXT;

-- Create index for OAuth lookups
CREATE INDEX IF NOT EXISTS idx_users_oauth ON users(oauth_provider, oauth_id);

-- Add constraint to ensure either password or oauth_provider is present
ALTER TABLE users ADD CONSTRAINT users_auth_check 
  CHECK (password IS NOT NULL OR oauth_provider IS NOT NULL);
