-- ============================================
-- SET OWNER ROLE FOR KINLCHDAVID@GMAIL.COM
-- ============================================
-- Run this in your Supabase SQL Editor

-- First, check if profiles table has role column
-- If it doesn't, add it
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'user'));

-- Update kinlchdavid@gmail.com to owner role
UPDATE profiles 
SET role = 'owner' 
WHERE email = 'kinlchdavid@gmail.com';

-- Verify the change
SELECT id, username, email, role, prompt_balance 
FROM profiles 
WHERE email = 'kinlchdavid@gmail.com';

-- ============================================
-- This will show you your profile with owner role!
-- ============================================
