# 🚀 Production Setup for www.hideoutbot.lol

## ✅ All Configurations Updated!

Your Hideout Bot is now configured for your production domain **https://www.hideoutbot.lol**

---

## 📝 What's Been Configured

### 1. **Roblox Plugin (Lua)**
- **File**: `plugin/HideoutBot_v2.lua`
- **API URL**: `https://www.hideoutbot.lol`
- **Polling**: Every 2 seconds for automatic syncing
- **Ready to download** from your Profile page

### 2. **Backend Server (Node.js)**
- **File**: `backend/.env.example`
- **Configured for**:
  - ✅ Supabase Database (PostgreSQL)
  - ✅ Supabase Authentication
  - ✅ CORS for your domain
  - ✅ WebSocket support
  - ✅ Plugin API endpoints

### 3. **Frontend Website (React)**
- **File**: `frontend/.env.example`
- **API URL**: `https://www.hideoutbot.lol`
- **Supabase**: Fully configured
- **WebSocket**: Connected to backend

---

## 🔐 Your Supabase Configuration

### Database Info:
- **Project**: `ietfjriwlsvdizjwttkb`
- **URL**: `https://ietfjriwlsvdizjwttkb.supabase.co`
- **Region**: `aws-1-us-east-1`

### Keys Configured:
- ✅ Anon Key (public, safe for frontend)
- ✅ Service Role Key (private, backend only)
- ✅ JWT Secret
- ✅ Database connection strings

---

## 📦 Environment Files Setup

### Backend (`backend/.env`)
Copy from `.env.example` - already configured with:
```bash
PORT=5000
FRONTEND_URL=https://www.hideoutbot.lol
SUPABASE_URL=https://ietfjriwlsvdizjwttkb.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
POSTGRES_URL=postgres://postgres.ietf...
# All database credentials included
```

### Frontend (`frontend/.env`)
Copy from `.env.example` - already configured with:
```bash
VITE_API_URL=https://www.hideoutbot.lol
VITE_SUPABASE_URL=https://ietfjriwlsvdizjwttkb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 🌐 Domain Configuration

### Your Domain: **www.hideoutbot.lol**

**Allowed Origins** (CORS configured):
- ✅ `https://www.hideoutbot.lol`
- ✅ `https://hideoutbot.lol`
- ✅ `http://localhost:3000` (for development)
- ✅ Roblox plugin (no origin check)

**WebSocket Connection**:
- Production: `wss://www.hideoutbot.lol`
- Local Dev: `ws://localhost:5000`

---

## 🔧 Deployment Steps

### 1. **Deploy Backend**
```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start server
npm start
```

Backend runs on port **5000** and connects to:
- Supabase PostgreSQL database
- Handles API requests from frontend
- Manages WebSocket connections
- Processes plugin requests

### 2. **Deploy Frontend**
```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy the `dist/` folder to your hosting (Vercel, Netlify, etc.)

### 3. **Plugin Distribution**
The plugin is already configured and ready to download from:
- **Website Profile Page**: Download button
- **Direct File**: `frontend/public/plugin/HideoutBot_v2.lua`

Users will:
1. Download from your website
2. Install in Roblox Studio
3. Connect with their API key
4. Start building automatically!

---

## 🔗 API Endpoints

All configured for **https://www.hideoutbot.lol**:

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/verify-plugin` - Plugin verification

### Prompts
- `POST /api/prompts/create` - Create new prompt (auto-generates actions)
- `GET /api/prompts/history` - Get user's prompts
- `GET /api/prompts/status/:id` - Check prompt status

### Plugin Sync
- `GET /api/plugin/changes/:projectId` - Get pending actions (polled by plugin)
- `POST /api/plugin/complete/:actionId` - Mark action complete

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details

---

## 🎮 How Users Will Use It

### 1. **Visit Your Website**
`https://www.hideoutbot.lol`

### 2. **Register/Login**
- Email + Password
- Or Discord OAuth

### 3. **Get API Key**
- Go to Profile page
- Copy API key

### 4. **Download Plugin**
- Click "Download Plugin" button
- Get `HideoutBot.lua` file

### 5. **Install Plugin**
- Open Roblox Studio
- PLUGINS → Plugins Folder
- Drag file in
- Restart Studio

### 6. **Connect Plugin**
- Click 🏝️ Hideout Bot button
- Paste API key
- Enter Project ID
- Click "Connect"

### 7. **Start Building!**
- Type prompts on website
- Plugin automatically syncs
- Builds appear in Roblox Studio
- Real-time updates everywhere!

---

## 🔒 Security Features

✅ **Environment Variables**: Sensitive keys in `.env` (not committed)
✅ **CORS Protection**: Only your domain allowed
✅ **JWT Authentication**: Secure user sessions
✅ **API Key Validation**: Plugin authentication
✅ **Rate Limiting**: Prevents abuse
✅ **Helmet.js**: Security headers
✅ **HTTPS**: Encrypted connections

---

## 📊 Database Tables (Supabase)

Your Supabase should have these tables:

### `profiles`
- User information
- API keys
- Prompt balances
- AWS configuration

### `projects`
- User projects
- Project IDs
- Metadata

### `prompts`
- User prompts
- AI-generated actions
- Status tracking
- Completion data

---

## ✨ Production Checklist

Before going live:

- [ ] Copy `.env.example` to `.env` in both `frontend/` and `backend/`
- [ ] Verify Supabase tables exist
- [ ] Test user registration/login
- [ ] Deploy backend to your server
- [ ] Deploy frontend to hosting
- [ ] Point DNS to your hosting
- [ ] Test plugin download from website
- [ ] Test plugin connection with API key
- [ ] Test prompt → action → build flow
- [ ] Enable SSL/HTTPS on your domain
- [ ] Set up monitoring/logging

---

## 🎯 You're Ready to Launch!

Everything is configured for **https://www.hideoutbot.lol**:

- ✅ Frontend configured
- ✅ Backend configured  
- ✅ Plugin configured
- ✅ Database configured
- ✅ CORS configured
- ✅ WebSocket configured
- ✅ Automatic syncing enabled

**Next Steps:**
1. Deploy your backend and frontend
2. Point your domain to the hosting
3. Users can start building Roblox games with AI! 🚀

---

**Need help?** All configuration files are in:
- `backend/.env.example` (copy to `.env`)
- `frontend/.env.example` (copy to `.env`)
- `plugin/HideoutBot_v2.lua` (ready to distribute)
