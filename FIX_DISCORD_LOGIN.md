# 🔧 Fix Discord Login Issue

## ❌ The Problem

You're getting this error:
```
ERROR: column "emailConfirmedAt" of relation "User" does not exist
```

This happens because Supabase has a database trigger that's using incorrect column names when trying to create user profiles from Discord OAuth.

## ✅ The Solution

### Step 1: Run the SQL Fix

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"+ New Query"**
4. Copy the entire contents of `DISCORD_OAUTH_FIX.sql`
5. Paste it into the SQL editor
6. Click **"Run"** or press `Ctrl+Enter`

### Step 2: Verify Discord OAuth is Configured

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Discord** and make sure it's **enabled**
3. Verify you have:
   - ✅ Discord Client ID
   - ✅ Discord Client Secret
   - ✅ Redirect URL: `https://www.hideoutbot.lol/auth/callback`

### Step 3: Test Discord Login

1. Go to https://www.hideoutbot.lol/login
2. Click **"Sign up with Discord"**
3. You should now be redirected to Discord
4. After authorizing, you'll be redirected back to the dashboard

## 🔍 What the Fix Does

The SQL script:

1. **Drops the problematic trigger** that was using wrong column names
2. **Creates a new trigger** with correct Supabase column names
3. **Creates the `profiles` table** if it doesn't exist
4. **Syncs Discord user data** to the profiles table automatically
5. **Sets up Row Level Security** for data protection

## ⚠️ Common Issues

### "Discord app not configured"
- Make sure you've set up a Discord application at https://discord.com/developers/applications
- Add the Client ID and Secret to Supabase

### "Redirect URI mismatch"
- In your Discord app settings, add: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
- Also add: `https://www.hideoutbot.lol/auth/callback`

### Still getting errors?
- Check browser console (F12) for detailed error messages
- Check Supabase logs in Dashboard → Logs

## 📝 Next Steps

After running the fix:

1. ✅ Discord login should work
2. ✅ User profiles are created automatically
3. ✅ API keys are generated for each user
4. ✅ Users get 100 prompts per day by default

---

**Need help?** Check the console logs when clicking "Login with Discord" - they'll show exactly what's happening!
