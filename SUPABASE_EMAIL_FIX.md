# 🔧 Fix Email Confirmation Issues

## Problem:
- You created account: `kinlchdavid@gmail.com`
- No verification email received
- Can't log in without verification

## Quick Fix Steps:

### 1. **Disable Email Confirmation Requirement**

Go to Supabase Dashboard → Authentication → Settings:

1. Navigate to: https://supabase.com/dashboard/project/ietfjriwlsvdizjwttkb/settings/auth
2. Scroll to **"Email Settings"**
3. Find **"Enable email confirmations"**
4. **Turn it OFF** (disable it)
5. Click **"Save"**

This allows users to login immediately without email verification.

### 2. **Manually Verify Your Email** (Optional but recommended)

1. Go to: https://supabase.com/dashboard/project/ietfjriwlsvdizjwttkb/auth/users
2. Find user: `kinlchdavid@gmail.com`
3. Click on the user
4. Toggle **"Email Confirmed"** to ON
5. Save

### 3. **Set Owner Role**

Run this in Supabase SQL Editor:

```sql
-- Add role column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'user'));

-- Set you as owner
UPDATE profiles 
SET role = 'owner' 
WHERE email = 'kinlchdavid@gmail.com';

-- Verify
SELECT id, username, email, role FROM profiles WHERE email = 'kinlchdavid@gmail.com';
```

### 4. **Configure Email Provider** (For future users)

To actually send verification emails, you need to configure an email provider:

**Option A: Use Supabase Built-in (Limited)**
- Go to Auth Settings
- Email templates are pre-configured
- Limited to 4 emails/hour on free tier

**Option B: Use Custom SMTP** (Recommended)
1. Go to: Auth → Settings → SMTP Settings
2. Configure your SMTP provider (Gmail, SendGrid, etc.)
3. Example with Gmail:
   - SMTP Host: `smtp.gmail.com`
   - Port: `587`
   - Username: Your Gmail
   - Password: App-specific password (not regular password)

---

## After Completing Steps Above:

✅ You can log in immediately: https://www.hideoutbot.lol/login
✅ Email: `kinlchdavid@gmail.com`
✅ Password: `Peaguyxx12!`
✅ You'll have **owner** role with full access
