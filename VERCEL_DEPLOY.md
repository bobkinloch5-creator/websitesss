# 🚀 Deploy to Vercel - Step by Step

## Quick Setup (Recommended)

### Option 1: Deploy Frontend Only (Easiest)

1. **Go to Vercel Dashboard**: https://vercel.com/new
2. **Import your GitHub repo**: `bobkinloch5-creator/newsite`
3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `dist` (or leave default)

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://www.hideoutbot.lol
   VITE_SUPABASE_URL=https://ietfjriwlsvdizjwttkb.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGZqcml3bHN2ZGl6and0dGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODM2NDMsImV4cCI6MjA3Nzc1OTY0M30.XMNDH7jWbVmQeEyKLOfr98B9XIPiqzuE1LmAKrXMTxY
   ```

5. **Click Deploy**

### Option 2: Deploy Full Stack (Frontend + Backend)

#### Deploy Backend First:
1. Create new Vercel project for backend
2. Root Directory: `backend`
3. Add all environment variables from `backend/.env`
4. Deploy and get your backend URL

#### Then Deploy Frontend:
1. Create new Vercel project for frontend  
2. Root Directory: `frontend`
3. Set `VITE_API_URL` to your backend Vercel URL
4. Add other environment variables
5. Deploy

---

## ⚙️ Vercel Project Settings

### Framework Preset
Select: **Vite**

### Root Directory  
Set to: **`frontend`**

This tells Vercel to build from the frontend folder.

### Build Settings
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Production API URL (your backend)
VITE_API_URL=https://www.hideoutbot.lol

# Supabase Configuration
VITE_SUPABASE_URL=https://ietfjriwlsvdizjwttkb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGZqcml3bHN2ZGl6and0dGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODM2NDMsImV4cCI6MjA3Nzc1OTY0M30.XMNDH7jWbVmQeEyKLOfr98B9XIPiqzuE1LmAKrXMTxY
```

---

## 🔧 Troubleshooting

### "vite: command not found"
- ✅ **Fixed**: Added `vercel-build` script to package.json
- The build command is now `vite build` directly

### "Root Directory Error"
- Set **Root Directory** to `frontend` in Vercel settings
- Don't leave it empty or set to root

### Build Timeout
- Vite builds are fast (< 2 minutes)
- If timeout, check dependencies in package.json

### Environment Variables Not Working
- Make sure variables start with `VITE_`
- Redeploy after adding new variables
- Check Vercel deployment logs

---

## 📱 Deploy Backend Separately

For the backend (Node.js API), you have options:

### 1. Vercel (Serverless)
- Create separate project
- Root Directory: `backend`
- Add backend environment variables
- Will run as serverless functions

### 2. Railway / Render (Better for WebSocket)
- Better for persistent connections
- Supports WebSocket fully
- Add all environment variables
- Start command: `npm start`

### 3. Your Own Server
- Deploy to VPS
- Run with PM2 or similar
- Configure nginx reverse proxy
- Best control and performance

---

## ✅ After Deployment

1. **Get your Vercel URL**: e.g., `hideoutbot.vercel.app`
2. **Point your domain**: 
   - Go to Vercel → Domains
   - Add `www.hideoutbot.lol`
   - Update DNS records
3. **Update plugin**: Set API_URL to your backend URL
4. **Test everything**:
   - Login/Register
   - Profile page
   - Download plugin
   - Chat functionality

---

## 🎯 Recommended Setup

**For Production:**

1. **Frontend on Vercel** ✅
   - Fast CDN
   - Automatic HTTPS
   - Easy rollbacks

2. **Backend on Railway/Render** ✅
   - Better for WebSocket
   - Persistent connections
   - Database connections

3. **Database on Supabase** ✅
   - Already configured
   - Auto-scaling
   - Built-in auth

This gives you the best performance and reliability!

---

## 📞 Need Help?

Check your deployment logs in Vercel dashboard for errors. Common issues are usually:
- Missing environment variables
- Wrong root directory
- Build command errors

Your repo is ready to deploy! Just set Root Directory to `frontend` and it should work. 🚀
