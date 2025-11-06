# 🔄 How Automatic Syncing Works

## Your Hideout Bot is Now Fully Automatic! ✨

### The Complete Sync Flow:

```
Website (TypeScript/React)
    ↓ (User types prompt)
    ↓
Backend (Node.js/JavaScript)
    ↓ (Generates actions)
    ↓
Roblox Plugin (Lua)
    ↓ (Executes in Studio)
    ↓
Your Game is Built! 🎮
```

---

## 🎯 How It Works Step-by-Step

### 1. **You Send a Prompt** (Website - TypeScript)
- Open http://localhost:3000/chat
- Type: "Create a red brick"
- Click Send

### 2. **Backend Processes It** (Node.js - JavaScript)  
- `/api/prompts/create` receives your prompt
- Automatically generates build actions:
  ```javascript
  {
    type: 'create_part',
    description: 'Creating a part',
    data: {
      name: 'Part',
      size: [4, 1, 2],
      position: [0, 5, 0],
      color: 'Bright red'
    }
  }
  ```
- Saves to database with `status: 'pending'`

### 3. **Plugin Polls for Actions** (Roblox - Lua)
- **Every 2 seconds**, the plugin checks:
  ```lua
  HttpService:GetAsync(API_URL .. "/api/plugin/changes/" .. projectId)
  ```
- Finds pending actions
- **Automatically executes them!**

### 4. **Plugin Builds in Studio** (Lua)
- Creates the red brick
- Updates the action status to `completed`
- Sends completion notice back to backend

### 5. **Website Gets Notified** (WebSocket)
- Chat shows: "✅ Completed: Creating a part"
- Navbar updates plugin status
- Everything syncs in real-time!

---

## 📝 The Languages Used

### Frontend (Website)
- **TypeScript/React** - Your website interface
- Files: `frontend/src/pages/Chat.tsx`, `Dashboard.tsx`, etc.

### Backend (Server)
- **JavaScript/Node.js** - Handles API requests
- Files: `backend/routes/prompts.js`, `plugin.js`, etc.

### Plugin (Roblox Studio)
- **Lua** - The Roblox programming language
- File: `plugin/HideoutBot_v2.lua`

---

## ⚙️ Configuration for Development

### Plugin Configuration (Lua)
```lua
-- In HideoutBot_v2.lua line 10:
local API_URL = "http://localhost:5000"  -- For local dev
local POLL_INTERVAL = 2  -- Checks every 2 seconds
```

### Website Configuration (TypeScript)
```typescript
// In frontend/src/pages/Chat.tsx:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### Backend Configuration (JavaScript)
```javascript
// In backend/routes/prompts.js:
// Automatically generates actions from prompts
```

---

## 🔍 How Automatic Polling Works

The plugin runs a **background loop** in Lua:

```lua
spawn(function()
    while isConnected do
        -- Check for new actions
        local result = HttpService:GetAsync(API_URL .. "/api/plugin/changes/" .. projectId)
        local data = HttpService:JSONDecode(result)
        
        if data.actions and #data.actions > 0 then
            -- AUTOMATICALLY EXECUTE THEM!
            for _, action in ipairs(data.actions) do
                processAction(action)
            end
        end
        
        wait(2)  -- Wait 2 seconds, then check again
    end
end)
```

This means:
- ✅ **No manual refresh needed**
- ✅ **Automatic execution** within 2 seconds
- ✅ **Always syncing** while connected
- ✅ **Real-time updates** to the website

---

## 🚀 Quick Start Guide

### 1. Start the Backend (JavaScript)
```bash
cd backend
npm start
```
Server runs on `http://localhost:5000`

### 2. Start the Website (TypeScript)
```bash
cd frontend
npm run dev
```
Website opens at `http://localhost:3000`

### 3. Install Plugin (Lua)
- Download from Profile page
- Put in Roblox Studio plugins folder
- Click 🏝️ Hideout Bot button
- Enter API Key and Project ID
- Click "Connect"

### 4. Start Building!
- Type in Chat: "Create a blue part"
- **Plugin automatically syncs and builds it!**
- See live updates in Studio and website

---

## 📊 What Gets Synced Automatically

### When You Send a Prompt:
1. ✅ Actions generated (JavaScript)
2. ✅ Saved to database
3. ✅ Plugin polls and finds them (Lua)
4. ✅ Executes in Roblox Studio (Lua)
5. ✅ Updates sent back to website (WebSocket)

### Types of Actions:
- **create_part** - Make bricks, walls, objects
- **create_script** - Add Lua scripts
- **create_ui** - Build interfaces
- **terrain_generate** - Create ground/terrain
- **create_model** - Make complex models
- **create_folder** - Organize workspace

---

## 🔧 How to Test Auto-Sync

### Test 1: Simple Part
```
Website Chat → "Create a red part"
Wait 2 seconds → Part appears in Studio!
```

### Test 2: Multiple Actions
```
Website Chat → "Create a blue brick and a script"
Wait 2 seconds → Both appear in Studio!
```

### Test 3: UI Element
```
Website Chat → "Create a button"
Wait 2 seconds → Button appears in StarterGui!
```

---

## 📡 Real-Time Communication

### WebSocket Events (Bidirectional)
```
Website ←→ Backend ←→ Plugin

Website sends:
- new_prompt (prompt submitted)

Plugin sends:
- plugin_heartbeat (I'm alive!)
- action_completed (finished building)

Backend broadcasts:
- new_actions (to plugin)
- action_completed (to website)
- plugin_connected (status update)
```

---

## ✨ Summary

Your system is **100% automatic**:

1. **Website (TypeScript)** - User interface
2. **Backend (JavaScript)** - Action generator
3. **Plugin (Lua)** - Auto-executor in Roblox

**No manual steps needed** - Just type and build! 🎮

The plugin is **already in Lua** and will work automatically once you connect it. The **polling happens every 2 seconds** in the background, so anything you create on the website appears in Roblox Studio automatically!

---

**Ready to build? Start all three services and watch the magic happen!** ✨
