-- ============================================
-- Discord OAuth Fix for Supabase
-- ============================================
-- This script fixes the column naming issue with Discord OAuth
-- Run this in your Supabase SQL Editor

-- 1. First, let's drop any existing problematic triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Create or replace the handle_new_user function with correct column names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_api_key TEXT;
BEGIN
  -- Generate a unique API key
  new_api_key := 'hb_' || encode(gen_random_bytes(24), 'hex');
  
  -- Insert into profiles table (not users table)
  INSERT INTO public.profiles (
    id,
    username,
    email,
    avatar_url,
    apiKey,
    prompt_balance,
    reset_time,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    new_api_key,
    100, -- Default prompt balance
    NOW() + INTERVAL '1 day',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    username = COALESCE(EXCLUDED.username, profiles.username),
    email = EXCLUDED.email,
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Make sure profiles table exists with correct schema
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  email TEXT,
  avatar_url TEXT,
  apiKey TEXT UNIQUE,
  prompt_balance INTEGER DEFAULT 100,
  reset_time TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 day'),
  aws_access_key TEXT,
  aws_secret_key TEXT,
  aws_region TEXT DEFAULT 'us-east-1',
  aws_configured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 7. Create index on apiKey for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_api_key ON public.profiles(apiKey);

-- ============================================
-- IMPORTANT: After running this, test Discord OAuth again!
-- ============================================
