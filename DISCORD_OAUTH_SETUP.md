# Discord OAuth Setup Guide

## Prerequisites

You mentioned you've already set up Discord OAuth in Supabase. This guide will help you complete the integration with your application.

## Required Environment Variables

### Backend (.env)
Make sure these variables are set in your backend `.env` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
OWNER_EMAIL=your_owner_email@example.com
```

### Frontend (.env.local)
Create or update `frontend/.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Supabase Configuration

1. **In your Supabase Dashboard:**
   - Go to Authentication > Providers
   - Enable Discord provider if not already enabled
   - Add your Discord OAuth App credentials:
     - Client ID from Discord Developer Portal
     - Client Secret from Discord Developer Portal
   - Set the Redirect URL to match your site URL + `/login`
     - For local development: `http://localhost:3000/login`
     - For production: `https://yourdomain.com/login`

2. **In Discord Developer Portal (https://discord.com/developers/applications):**
   - Select your application or create a new one
   - Go to OAuth2 > General
   - Add redirect URIs:
     - `http://localhost:3000/login` (for development)
     - `https://yourdomain.com/login` (for production)
     - Your Supabase callback URL (usually `https://[project-ref].supabase.co/auth/v1/callback`)

## Database Migration

Run the OAuth migration to update your database schema:

```bash
cd backend
node migrations/run_migration.js
```

This will add OAuth support to your users table, allowing users to sign in with Discord.

## How It Works

1. **User clicks "Sign in with Discord"** on the login page
2. **Redirected to Discord** for authorization
3. **Discord redirects back** to your app with authentication data
4. **Supabase handles the OAuth flow** and provides tokens
5. **Your backend creates/updates user** in your database
6. **JWT token issued** for your app's authentication
7. **User is logged in** and redirected to dashboard

## Testing the Integration

1. **Start your backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start your frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the flow:**
   - Go to http://localhost:3000/login
   - Click "Sign in with Discord"
   - Authorize the app in Discord
   - You should be redirected back and logged in

## Troubleshooting

### Common Issues:

1. **"Invalid Discord authentication" error**
   - Check that your Supabase URL and keys are correct
   - Verify Discord OAuth is enabled in Supabase
   - Ensure redirect URLs match exactly

2. **Redirect loop or stuck on login**
   - Check that the redirect URL in Supabase matches your app URL
   - Clear browser cookies and localStorage
   - Check browser console for errors

3. **"Missing Supabase environment variables" warning**
   - Ensure all required environment variables are set
   - Restart your development servers after adding env variables

4. **User created but can't access features**
   - Check that the user role is being set correctly
   - Verify the API key is being generated for new OAuth users

## Security Notes

- Never expose your `SUPABASE_SERVICE_ROLE_KEY` to the frontend
- Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` for frontend operations
- Keep your Discord Client Secret secure and never commit it to version control
- Use environment variables for all sensitive configuration

## Production Deployment

When deploying to production:

1. Update all redirect URLs to use your production domain
2. Set production environment variables in Vercel/your hosting platform
3. Update Discord OAuth redirect URIs in Discord Developer Portal
4. Update Supabase Authentication settings with production URLs
5. Run database migrations on your production database

## Additional Features

The implementation includes:
- Automatic user creation for new Discord users
- Existing user login for returning Discord users
- Random secure password generation for OAuth users
- Daily prompt limit management
- API key generation for plugin access
- Role assignment (owner role for specified email)
