-- ============================================
-- SET OWNER ROLE FOR KINLCHDAVID@GMAIL.COM
-- ============================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ietfjriwlsvdizjwttkb/sql/new

-- Step 1: Add role column to profiles table (if it doesn't exist)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'user'));

-- Step 2: Set kinlchdavid@gmail.com as owner
UPDATE profiles 
SET role = 'owner' 
WHERE email = 'kinlchdavid@gmail.com';

-- Step 3: Verify the change worked - you should see your profile with role='owner'
SELECT id, username, email, role, prompt_balance, aws_configured 
FROM profiles 
WHERE email = 'kinlchdavid@gmail.com';

-- ============================================
-- EXPECTED RESULT:
-- You should see 1 row with:
-- - email: kinlchdavid@gmail.com
-- - role: owner
-- - username: (your username)
-- - prompt_balance: 100
-- ============================================
