# Discord OAuth Complete Setup Guide

## ✅ Configuration Checklist

### 1. Discord Application Settings
**OAuth2 Redirect URL in Discord Developer Portal:**
```
https://ietfjriwlsvdizjwttkb.supabase.co/auth/v1/callback
```
✅ This URL must be added to your Discord application's OAuth2 redirect URIs

### 2. Supabase Configuration
**In Supabase Dashboard > Authentication > Providers > Discord:**
- ✅ Discord enabled
- ✅ Client ID: (from Discord Developer Portal)
- ✅ Client Secret: (from Discord Developer Portal)
- ✅ Redirect URL: `https://www.hideoutbot.lol/login`

### 3. Frontend Configuration
**Login Page (`frontend/pages/login.js`):**
- ✅ Updated to handle Discord OAuth callback
- ✅ Fixed hydration errors with `isClient` flag
- ✅ Proper error handling for object/string errors
- ✅ Beautiful Discord button with animations
- ✅ Redirect URL set to: `https://www.hideoutbot.lol/login`

### 4. Backend Configuration
**Auth Routes (`backend/routes/auth.js`):**
- ✅ Discord endpoint accepts Supabase JWT access token
- ✅ Creates new users from Discord OAuth
- ✅ Handles existing users
- ✅ Proper email validation

### 5. CSS Styling
**Global Styles (`frontend/styles/globals.css`):**
- ✅ Beautiful Discord button with gradient background
- ✅ Hover animations and effects
- ✅ Glow effect on hover
- ✅ Icon bounce animation
- ✅ Slide shine effect

## OAuth Flow

1. **User clicks "Sign in with Discord"**
   - Button triggers `handleDiscordLogin()`
   
2. **Redirect to Discord**
   - User authorizes the application
   - Discord redirects to: `https://ietfjriwlsvdizjwttkb.supabase.co/auth/v1/callback`

3. **Supabase processes authentication**
   - Validates Discord tokens
   - Creates/updates Supabase user
   - Redirects to: `https://www.hideoutbot.lol/login`

4. **Frontend handles callback**
   - `useEffect` detects session with access token
   - Sends token to backend `/api/auth/discord`
   
5. **Backend validates and creates JWT**
   - Validates Supabase session
   - Creates/updates user in database
   - Returns JWT token

6. **User redirected to dashboard**
   - JWT stored in localStorage
   - User authenticated and logged in

## Error Handling

### Fixed Issues:
1. **React Error #418 & #423**: Hydration mismatches resolved with client-side only execution
2. **React Error #31**: Objects as React children fixed with proper error extraction
3. **500 Error**: Backend properly handles Supabase JWT tokens
4. **Error Display**: All errors now display as strings with fallbacks

## Button Features

The Discord button includes:
- 🎨 Discord brand colors (#5865F2)
- ✨ Glow effect on hover
- 📱 Responsive design
- ♿ Disabled state handling
- 🎭 Multiple animation layers
- 💫 Smooth transitions

## Testing Checklist

- [ ] Click "Sign in with Discord" button
- [ ] Verify redirect to Discord OAuth page
- [ ] Authorize the application
- [ ] Verify redirect back to login page
- [ ] Check if user is created/logged in
- [ ] Verify redirect to dashboard
- [ ] Check JWT token in localStorage
- [ ] Test with existing user
- [ ] Test with new user
- [ ] Test error scenarios

## Environment Variables Required

### Frontend (.env.local):
```
NEXT_PUBLIC_SUPABASE_URL=https://ietfjriwlsvdizjwttkb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=https://www.hideoutbot.lol/api
```

### Backend (.env):
```
SUPABASE_URL=https://ietfjriwlsvdizjwttkb.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
```

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure Discord OAuth redirect URL matches exactly
4. Check Supabase logs for authentication errors
5. Verify backend is running and accessible
