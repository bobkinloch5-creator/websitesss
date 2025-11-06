# 🏝️ Hideout Bot - Complete Setup Guide

## ✅ Your Website is Now Ready!

The website has been fully transformed with all the features you requested:

### 🌐 Website Features
- **Modern Dashboard** - Project management with sync status
- **AI Chat System** - Send prompts to build your games
- **Plan Mode** - Get A/B/C options before building
- **Templates Library** - Quick-start prompts for common features
- **Profile Page** - API key display, plugin download, AWS integration
- **Real-time Plugin Status** - See when your Roblox plugin connects

### 🔌 Roblox Plugin Integration

Your Roblox Studio plugin is fully integrated with the website!

#### How It Works:
1. **Website → Backend → Plugin**
   - You send a prompt on the website
   - Backend processes it and creates build actions
   - Plugin polls for new actions and executes them in Roblox Studio

2. **Plugin → Backend → Website**
   - Plugin connects and sends heartbeats
   - Backend notifies the website via WebSocket
   - Website shows "Plugin Connected" status

#### Setup Instructions:

1. **Get Your API Key**
   - Go to your Profile page (`/profile`)
   - Copy your unique API key

2. **Download the Plugin**
   - Click "Download Plugin" on the Profile page
   - Saves as `HideoutBot.lua`

3. **Install in Roblox Studio**
   - Open Roblox Studio
   - Go to **PLUGINS** tab → Click **Plugins Folder** button
   - Drag `HideoutBot.lua` into the folder
   - Restart Roblox Studio

4. **Connect the Plugin**
   - Click the **🏝️ Hideout Bot** button in the toolbar
   - Paste your API key
   - Enter your Project ID (from Dashboard)
   - Click "Connect to Hideout Bot"

5. **Start Building!**
   - Go to the website Chat page
   - Describe what you want to build
   - Watch as the plugin creates it in Roblox Studio!

### 🔧 API Endpoints for Plugin

The plugin uses these endpoints:

- **`GET /api/auth/verify-plugin?key=<apiKey>`** - Verify API key
- **`GET /api/plugin/changes/:projectId`** - Get pending actions
- **`POST /api/plugin/complete/:actionId`** - Mark action as complete

### 🌐 Environment Setup

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000
```

**Backend** (`backend/.env`):
Already configured with your Supabase credentials

### 🚀 Running the Application

**Start Backend:**
```bash
cd backend
npm start
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

The website will open at `http://localhost:3000`

### 📡 WebSocket Communication

The website and plugin communicate in real-time:

- **Website → Plugin**: New build actions, updates
- **Plugin → Website**: Connection status, completion notifications
- **Status Display**: Navbar shows live plugin connection status

### 🎨 Plugin Features in Studio

When connected, the plugin can:
- ✅ Create parts, models, and folders
- ✅ Write and insert scripts (Script, LocalScript, ModuleScript)
- ✅ Generate terrain
- ✅ Create UI elements (ScreenGuis, TextButtons, etc.)
- ✅ Modify properties (colors, positions, materials)
- ✅ Set up lighting
- ✅ Organize files intelligently

### 🔑 Security

- API keys are encrypted in the database
- Plugin authenticates with every request
- User-specific project isolation
- All actions are logged and tracked

### 📝 Next Steps

1. ✅ Website is running
2. ✅ Plugin file is available for download
3. ✅ WebSocket integration is active
4. ⏭️ Install plugin in Roblox Studio
5. ⏭️ Connect and start building!

---

**Need Help?**
- Check the console logs in both the website and Roblox Studio
- Plugin logs appear in the "Activity Log" section
- Website connection status shows in the Navbar

🎮 **Happy Building with Hideout Bot!** 🏝️
