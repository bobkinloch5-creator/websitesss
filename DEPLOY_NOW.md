# 🚀 Deploy Your Hideout Bot - Complete Guide

## ✅ Everything is Ready to Deploy!

Your repository is configured and ready: **https://github.com/bobkinloch5-creator/newsite**

---

## 📦 Option 1: Deploy Frontend to Vercel (Recommended - 5 minutes)

### Step-by-Step:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with GitHub

2. **Import Your Repository**
   - Click "Import Git Repository"
   - Select: `bobkinloch5-creator/newsite`
   - Click "Import"

3. **⚠️ CRITICAL - Configure Project Settings**
   ```
   Project Name: hideoutbot (or whatever you want)
   Framework Preset: Vite
   Root Directory: frontend        ← MUST SET THIS!
   Build Command: npm run build    (leave default)
   Output Directory: dist          (leave default)
   Install Command: npm install    (leave default)
   ```

4. **Add Environment Variables**
   Click "Environment Variables" tab and add these:
   
   **Variable 1:**
   - Name: `VITE_API_URL`
   - Value: `https://www.hideoutbot.lol`
   
   **Variable 2:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://ietfjriwlsvdizjwttkb.supabase.co`
   
   **Variable 3:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGZqcml3bHN2ZGl6and0dGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODM2NDMsImV4cCI6MjA3Nzc1OTY0M30.XMNDH7jWbVmQeEyKLOfr98B9XIPiqzuE1LmAKrXMTxY`

5. **Click "Deploy"**
   - Wait 1-2 minutes
   - Your site will be live at `https://yourproject.vercel.app`

6. **Add Your Custom Domain**
   - Go to: Project Settings → Domains
   - Add: `www.hideoutbot.lol`
   - Follow DNS instructions to point to Vercel

---

## 🖥️ Option 2: Deploy Backend to Railway (Recommended - 10 minutes)

Railway is better than Vercel for the backend because it supports:
- ✅ Persistent connections
- ✅ WebSocket (for real-time plugin sync)
- ✅ Long-running processes

### Step-by-Step:

1. **Go to Railway**
   - Visit: https://railway.app
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `bobkinloch5-creator/newsite`

3. **Configure Service**
   - Set Root Directory: `backend`
   - Set Start Command: `npm start`
   - Or Railway will auto-detect from package.json

4. **Add Environment Variables**
   Go to Variables tab and add all from `backend/.env`:
   
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://www.hideoutbot.lol
   OWNER_EMAIL=kinlchdavid@gmail.com
   JWT_SECRET=4/9A5Jp+t6S7LF8TNQtYB6JIkRDF8QWipiM1gNbAz8Z14mCbCy9NZkbK3OR+6NUwxQ7RbhTFDHrAVGN6nTFzVA==
   SUPABASE_URL=https://ietfjriwlsvdizjwttkb.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGZqcml3bHN2ZGl6and0dGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODM2NDMsImV4cCI6MjA3Nzc1OTY0M30.XMNDH7jWbVmQeEyKLOfr98B9XIPiqzuE1LmAKrXMTxY
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGZqcml3bHN2ZGl6and0dGtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjE4MzY0MywiZXhwIjoyMDc3NzU5NjQzfQ.lmD6ClIu2uouLQh3q9kuUFF4CECcbUbCmTZ_ZOE4Rok
   SUPABASE_JWT_SECRET=4/9A5Jp+t6S7LF8TNQtYB6JIkRDF8QWipiM1gNbAz8Z14mCbCy9NZkbK3OR+6NUwxQ7RbhTFDHrAVGN6nTFzVA==
   POSTGRES_URL=postgres://postgres.ietfjriwlsvdizjwttkb:383r6JWf66ex02em@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
   POSTGRES_PRISMA_URL=postgres://postgres.ietfjriwlsvdizjwttkb:383r6JWf66ex02em@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
   POSTGRES_URL_NON_POOLING=postgres://postgres.ietfjriwlsvdizjwttkb:383r6JWf66ex02em@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
   POSTGRES_USER=postgres
   POSTGRES_HOST=db.ietfjriwlsvdizjwttkb.supabase.co
   POSTGRES_PASSWORD=383r6JWf66ex02em
   POSTGRES_DATABASE=postgres
   ```

5. **Deploy**
   - Click Deploy
   - Get your Railway URL (e.g., `yourapp.railway.app`)

6. **Update Frontend to Use Backend URL**
   - Go back to Vercel project
   - Update `VITE_API_URL` to your Railway URL
   - Redeploy

---

## 🎯 Alternative: Deploy Backend to Render

Similar to Railway, also good for WebSocket:

1. **Go to Render**: https://render.com
2. **New Web Service**
3. **Connect GitHub**: `bobkinloch5-creator/newsite`
4. **Configure**:
   - Name: `hideoutbot-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add Environment Variables** (same as Railway)
6. **Create Web Service**

---

## 📋 Post-Deployment Checklist

After both are deployed:

### 1. Update URLs
- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Custom domain pointed to Vercel
- [ ] Update `VITE_API_URL` in frontend to backend URL

### 2. Update Plugin
Edit `plugin/HideoutBot_v2.lua` line 10:
```lua
local API_URL = "https://your-backend-url.railway.app"
```
Commit and push to GitHub

### 3. Test Everything
- [ ] Visit your website
- [ ] Register a new account
- [ ] Login works
- [ ] Profile page shows API key
- [ ] Download plugin works
- [ ] Backend API responds (check `/api/health` if you have it)

### 4. DNS Configuration
Point your domain to Vercel:
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`
- TTL: `3600`

---

## 🚀 Quick Deploy (Frontend Only - Fastest)

If you want to deploy ASAP and test:

1. Deploy frontend to Vercel (5 mins)
2. Keep backend running locally (`npm start` in backend folder)
3. Use ngrok to expose local backend: `ngrok http 5000`
4. Update frontend `VITE_API_URL` to ngrok URL
5. Test everything
6. Later deploy backend properly

---

## ⚡ Recommended Final Setup

For best performance:

```
┌─────────────────────────────────────┐
│  www.hideoutbot.lol (Vercel)        │
│  Frontend - React + Vite             │
│  - Fast CDN                          │
│  - Auto SSL                          │
│  - Instant deploys                   │
└─────────────┬───────────────────────┘
              │
              ↓ API Calls
┌─────────────────────────────────────┐
│  api.hideoutbot.lol (Railway)       │
│  Backend - Node.js + Express         │
│  - WebSocket support                 │
│  - Persistent connections            │
│  - Database connection pooling       │
└─────────────┬───────────────────────┘
              │
              ↓ Database
┌─────────────────────────────────────┐
│  Supabase PostgreSQL                │
│  - Already configured                │
│  - Auth handled                      │
│  - Auto scaling                      │
└─────────────────────────────────────┘
              ↑
              │ Plugin Syncs
┌─────────────────────────────────────┐
│  Roblox Studio Plugin (Lua)         │
│  - Downloads from website            │
│  - Connects to backend               │
│  - Syncs every 2 seconds             │
└─────────────────────────────────────┘
```

---

## 💡 Tips

1. **Deploy frontend first** - It's easier and you can see the UI
2. **Test locally before deploying backend** - Make sure it works
3. **Use Railway/Render for backend** - Better than Vercel for Node.js APIs
4. **Monitor your logs** - Check Vercel/Railway logs for errors
5. **Start with free tiers** - Both Vercel and Railway have free tiers

---

## 🆘 If You Get Stuck

**Frontend won't build:**
- Check that Root Directory is set to `frontend`
- Verify environment variables are added
- Check Vercel build logs

**Backend won't deploy:**
- Make sure all environment variables are set
- Check that package.json has correct scripts
- Verify database connection strings

**Plugin can't connect:**
- Update API_URL in plugin to your backend URL
- Check CORS settings in backend
- Verify API key is correct

---

## ✅ You're Ready!

Your application is configured and ready to deploy. Choose your hosting platform and follow the steps above. Your Hideout Bot will be live in minutes! 🎉

**Need help? Check the deployment logs for specific errors.**
