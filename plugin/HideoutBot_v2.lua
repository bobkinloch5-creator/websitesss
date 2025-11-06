-- 🏝️ Hideout Bot Plugin v2.0.0
-- Enhanced version with WebSocket support and project sync
local HttpService = game:GetService("HttpService")
local InsertService = game:GetService("InsertService")
local ChangeHistoryService = game:GetService("ChangeHistoryService")
local RunService = game:GetService("RunService")
local Selection = game:GetService("Selection")

-- Configuration
local API_URL = "https://www.hideoutbot.lol"  -- Your production domain!
-- For local development, change to: "http://localhost:5000"
local POLL_INTERVAL = 2  -- Check for new actions every 2 seconds (automatic syncing!)

-- Plugin Setup
local toolbar = plugin:CreateToolbar("🏝️ Hideout Bot")
local connectButton = toolbar:CreateButton(
	"Connect",
	"Connect to Hideout Bot",
	"rbxassetid://4458901886"
)

-- State
local pluginGui = nil
local apiKey = ""
local projectId = ""
local isConnected = false
local syncEnabled = true
local fileStructure = {}
local actionQueue = {}
local logMessages = {}

-- Create Enhanced GUI
local function createGUI()
	local info = DockWidgetPluginGuiInfo.new(
		Enum.InitialDockState.Right,
		false,
		false,
		400,
		600,
		350,
		400
	)
	
	pluginGui = plugin:CreateDockWidgetPluginGui("HideoutBotWidget", info)
	pluginGui.Title = "🏝️ Hideout Bot AI v2"

	-- Main Container
	local mainFrame = Instance.new("Frame")
	mainFrame.Size = UDim2.new(1, 0, 1, 0)
	mainFrame.BackgroundColor3 = Color3.fromRGB(15, 23, 42)
	mainFrame.BorderSizePixel = 0
	mainFrame.Parent = pluginGui

	-- Gradient Background
	local gradient = Instance.new("UIGradient")
	gradient.Color = ColorSequence.new({
		ColorSequenceKeypoint.new(0, Color3.fromRGB(15, 23, 42)),
		ColorSequenceKeypoint.new(1, Color3.fromRGB(26, 26, 46))
	})
	gradient.Rotation = 45
	gradient.Parent = mainFrame

	-- Header
	local header = Instance.new("Frame")
	header.Size = UDim2.new(1, 0, 0, 80)
	header.BackgroundColor3 = Color3.fromRGB(30, 41, 59)
	header.BorderSizePixel = 0
	header.Parent = mainFrame

	local title = Instance.new("TextLabel")
	title.Size = UDim2.new(1, -20, 0, 30)
	title.Position = UDim2.new(0, 10, 0, 10)
	title.Text = "🏝️ Hideout Bot"
	title.TextColor3 = Color3.fromRGB(102, 126, 234)
	title.TextSize = 24
	title.Font = Enum.Font.GothamBold
	title.BackgroundTransparency = 1
	title.Parent = header

	local subtitle = Instance.new("TextLabel")
	subtitle.Size = UDim2.new(1, -20, 0, 20)
	subtitle.Position = UDim2.new(0, 10, 0, 40)
	subtitle.Text = "AI-Powered Game Builder"
	subtitle.TextColor3 = Color3.fromRGB(148, 163, 184)
	subtitle.TextSize = 14
	subtitle.Font = Enum.Font.Gotham
	subtitle.BackgroundTransparency = 1
	subtitle.Parent = header

	-- Connection Section
	local connectionFrame = Instance.new("Frame")
	connectionFrame.Size = UDim2.new(1, -20, 0, 200)
	connectionFrame.Position = UDim2.new(0, 10, 0, 90)
	connectionFrame.BackgroundColor3 = Color3.fromRGB(30, 41, 59)
	connectionFrame.BorderSizePixel = 0
	connectionFrame.Parent = mainFrame

	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, 12)
	corner.Parent = connectionFrame

	-- API Key Input
	local apiKeyLabel = Instance.new("TextLabel")
	apiKeyLabel.Size = UDim2.new(1, -20, 0, 20)
	apiKeyLabel.Position = UDim2.new(0, 10, 0, 10)
	apiKeyLabel.Text = "🔑 API Key"
	apiKeyLabel.TextColor3 = Color3.fromRGB(241, 245, 249)
	apiKeyLabel.TextSize = 12
	apiKeyLabel.Font = Enum.Font.GothamBold
	apiKeyLabel.TextXAlignment = Enum.TextXAlignment.Left
	apiKeyLabel.BackgroundTransparency = 1
	apiKeyLabel.Parent = connectionFrame

	local apiKeyInput = Instance.new("TextBox")
	apiKeyInput.Size = UDim2.new(1, -20, 0, 35)
	apiKeyInput.Position = UDim2.new(0, 10, 0, 35)
	apiKeyInput.PlaceholderText = "Enter your API key..."
	apiKeyInput.Text = plugin:GetSetting("HideoutBot_APIKey") or ""
	apiKeyInput.TextColor3 = Color3.fromRGB(255, 255, 255)
	apiKeyInput.BackgroundColor3 = Color3.fromRGB(51, 65, 85)
	apiKeyInput.BorderSizePixel = 0
	apiKeyInput.TextSize = 12
	apiKeyInput.Font = Enum.Font.Code
	apiKeyInput.Parent = connectionFrame

	local apiCorner = Instance.new("UICorner")
	apiCorner.CornerRadius = UDim.new(0, 8)
	apiCorner.Parent = apiKeyInput

	-- Project ID Input
	local projectLabel = Instance.new("TextLabel")
	projectLabel.Size = UDim2.new(1, -20, 0, 20)
	projectLabel.Position = UDim2.new(0, 10, 0, 80)
	projectLabel.Text = "📁 Project ID"
	projectLabel.TextColor3 = Color3.fromRGB(241, 245, 249)
	projectLabel.TextSize = 12
	projectLabel.Font = Enum.Font.GothamBold
	projectLabel.TextXAlignment = Enum.TextXAlignment.Left
	projectLabel.BackgroundTransparency = 1
	projectLabel.Parent = connectionFrame

	local projectInput = Instance.new("TextBox")
	projectInput.Size = UDim2.new(1, -20, 0, 35)
	projectInput.Position = UDim2.new(0, 10, 0, 105)
	projectInput.PlaceholderText = "Enter project ID..."
	projectInput.Text = plugin:GetSetting("HideoutBot_ProjectID") or ""
	projectInput.TextColor3 = Color3.fromRGB(255, 255, 255)
	projectInput.BackgroundColor3 = Color3.fromRGB(51, 65, 85)
	projectInput.BorderSizePixel = 0
	projectInput.TextSize = 12
	projectInput.Font = Enum.Font.Code
	projectInput.Parent = connectionFrame

	local projectCorner = Instance.new("UICorner")
	projectCorner.CornerRadius = UDim.new(0, 8)
	projectCorner.Parent = projectInput

	-- Connect Button
	local connectBtn = Instance.new("TextButton")
	connectBtn.Size = UDim2.new(1, -20, 0, 40)
	connectBtn.Position = UDim2.new(0, 10, 0, 150)
	connectBtn.Text = "⚡ Connect to Hideout Bot"
	connectBtn.TextColor3 = Color3.fromRGB(255, 255, 255)
	connectBtn.BackgroundColor3 = Color3.fromRGB(102, 126, 234)
	connectBtn.TextSize = 14
	connectBtn.Font = Enum.Font.GothamBold
	connectBtn.BorderSizePixel = 0
	connectBtn.Parent = connectionFrame

	local connectCorner = Instance.new("UICorner")
	connectCorner.CornerRadius = UDim.new(0, 8)
	connectCorner.Parent = connectBtn

	-- Status Section
	local statusFrame = Instance.new("Frame")
	statusFrame.Size = UDim2.new(1, -20, 0, 60)
	statusFrame.Position = UDim2.new(0, 10, 0, 300)
	statusFrame.BackgroundColor3 = Color3.fromRGB(30, 41, 59)
	statusFrame.BorderSizePixel = 0
	statusFrame.Parent = mainFrame

	local statusCorner = Instance.new("UICorner")
	statusCorner.CornerRadius = UDim.new(0, 12)
	statusCorner.Parent = statusFrame

	local statusLabel = Instance.new("TextLabel")
	statusLabel.Size = UDim2.new(1, -20, 0, 25)
	statusLabel.Position = UDim2.new(0, 10, 0, 5)
	statusLabel.Text = "⚪ Disconnected"
	statusLabel.TextColor3 = Color3.fromRGB(148, 163, 184)
	statusLabel.TextSize = 14
	statusLabel.Font = Enum.Font.GothamBold
	statusLabel.BackgroundTransparency = 1
	statusLabel.Parent = statusFrame

	local syncLabel = Instance.new("TextLabel")
	syncLabel.Size = UDim2.new(1, -20, 0, 20)
	syncLabel.Position = UDim2.new(0, 10, 0, 30)
	syncLabel.Text = "Ready to sync your projects"
	syncLabel.TextColor3 = Color3.fromRGB(148, 163, 184)
	syncLabel.TextSize = 12
	syncLabel.Font = Enum.Font.Gotham
	syncLabel.BackgroundTransparency = 1
	syncLabel.Parent = statusFrame

	-- Action Log
	local logLabel = Instance.new("TextLabel")
	logLabel.Size = UDim2.new(1, -20, 0, 20)
	logLabel.Position = UDim2.new(0, 10, 0, 370)
	logLabel.Text = "📋 Activity Log"
	logLabel.TextColor3 = Color3.fromRGB(241, 245, 249)
	logLabel.TextSize = 12
	logLabel.Font = Enum.Font.GothamBold
	logLabel.TextXAlignment = Enum.TextXAlignment.Left
	logLabel.BackgroundTransparency = 1
	logLabel.Parent = mainFrame

	local logFrame = Instance.new("ScrollingFrame")
	logFrame.Size = UDim2.new(1, -20, 1, -400)
	logFrame.Position = UDim2.new(0, 10, 0, 395)
	logFrame.BackgroundColor3 = Color3.fromRGB(30, 41, 59)
	logFrame.BorderSizePixel = 0
	logFrame.ScrollBarThickness = 4
	logFrame.ScrollBarImageColor3 = Color3.fromRGB(102, 126, 234)
	logFrame.CanvasSize = UDim2.new(0, 0, 0, 0)
	logFrame.Parent = mainFrame

	local logCorner = Instance.new("UICorner")
	logCorner.CornerRadius = UDim.new(0, 12)
	logCorner.Parent = logFrame

	local logLayout = Instance.new("UIListLayout")
	logLayout.Padding = UDim.new(0, 5)
	logLayout.Parent = logFrame

	-- Log function
	local function logMessage(message, messageType)
		local logEntry = Instance.new("Frame")
		logEntry.Size = UDim2.new(1, -10, 0, 25)
		logEntry.BackgroundColor3 = Color3.fromRGB(51, 65, 85)
		logEntry.BorderSizePixel = 0
		logEntry.Parent = logFrame

		local entryCorner = Instance.new("UICorner")
		entryCorner.CornerRadius = UDim.new(0, 6)
		entryCorner.Parent = logEntry

		local icon = ""
		local color = Color3.fromRGB(255, 255, 255)
		
		if messageType == "success" then
			icon = "✅"
			color = Color3.fromRGB(74, 222, 128)
		elseif messageType == "error" then
			icon = "❌"
			color = Color3.fromRGB(248, 113, 113)
		elseif messageType == "info" then
			icon = "ℹ️"
			color = Color3.fromRGB(96, 165, 250)
		elseif messageType == "warning" then
			icon = "⚠️"
			color = Color3.fromRGB(251, 191, 36)
		else
			icon = "📝"
		end

		local text = Instance.new("TextLabel")
		text.Size = UDim2.new(1, -10, 1, 0)
		text.Position = UDim2.new(0, 5, 0, 0)
		text.Text = icon .. " " .. os.date("[%H:%M:%S] ") .. message
		text.TextColor3 = color
		text.TextSize = 11
		text.Font = Enum.Font.Code
		text.TextXAlignment = Enum.TextXAlignment.Left
		text.BackgroundTransparency = 1
		text.TextWrapped = true
		text.Parent = logEntry

		-- Auto-scroll to bottom
		logLayout:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
			logFrame.CanvasSize = UDim2.new(0, 0, 0, logLayout.AbsoluteContentSize.Y + 10)
			logFrame.CanvasPosition = Vector2.new(0, logLayout.AbsoluteContentSize.Y)
		end)
	end

	-- Connect Button Handler
	connectBtn.MouseButton1Click:Connect(function()
		apiKey = apiKeyInput.Text
		projectId = projectInput.Text
		
		if apiKey == "" or projectId == "" then
			logMessage("Please enter both API key and Project ID", "error")
			return
		end

		plugin:SetSetting("HideoutBot_APIKey", apiKey)
		plugin:SetSetting("HideoutBot_ProjectID", projectId)

		-- Verify connection
		local success, result = pcall(function()
			return HttpService:GetAsync(API_URL .. "/api/auth/verify-plugin?key=" .. apiKey)
		end)

		if success then
			local data = HttpService:JSONDecode(result)
			if data.valid then
				isConnected = true
				statusLabel.Text = "🟢 Connected"
				statusLabel.TextColor3 = Color3.fromRGB(74, 222, 128)
				syncLabel.Text = "Syncing with project: " .. projectId
				connectBtn.Text = "✅ Connected - Click to Disconnect"
				connectBtn.BackgroundColor3 = Color3.fromRGB(74, 222, 128)
				logMessage("Successfully connected to Hideout Bot!", "success")
				startSync()
			else
				logMessage("Invalid API key. Get your key from hideoutbot.lol/profile", "error")
			end
		else
			logMessage("Connection failed. Check your internet connection.", "error")
		end
	end)

	return logMessage
end

-- Forward declare functions
local startSync, processAction, notifyCompletion

-- Sync Functions (AUTOMATIC POLLING - checks backend every 2 seconds!)
startSync = function()
	local logMsg = _G.HideoutBotLog or print
	logMsg("🔄 Starting automatic sync - polling every " .. POLL_INTERVAL .. " seconds", "info")
	
	spawn(function()
		while isConnected do
			-- Poll for new actions from backend (AUTOMATIC SYNC!)
			local success, result = pcall(function()
				return HttpService:GetAsync(API_URL .. "/api/plugin/changes/" .. projectId)
			end)
			
			if success then
				local data = HttpService:JSONDecode(result)
				if data.actions and #data.actions > 0 then
					logMsg("📥 Found " .. #data.actions .. " new action(s) to execute!", "info")
					for _, action in ipairs(data.actions) do
						processAction(action)
					end
				end
			else
				-- Connection error - will retry automatically
				logMsg("⚠️ Sync check failed - will retry in " .. POLL_INTERVAL .. "s", "warning")
			end
			
			wait(POLL_INTERVAL)
		end
	end)
end

processAction = function(action)
	local logMsg = _G.HideoutBotLog or print
	logMsg("Processing: " .. action.description, "info")
	
	local success, error = pcall(function()
		if action.type == "create_part" then
			createPart(action.data)
		elseif action.type == "create_script" then
			createScript(action.data)
		elseif action.type == "create_model" then
			createModel(action.data)
		elseif action.type == "modify_properties" then
			modifyProperties(action.data)
		elseif action.type == "create_folder" then
			createFolder(action.data)
		elseif action.type == "terrain_generate" then
			generateTerrain(action.data)
		elseif action.type == "create_ui" then
			createUI(action.data)
		elseif action.type == "lighting_setup" then
			setupLighting(action.data)
		end
	end)
	
	if success then
		logMsg("Completed: " .. action.description, "success")
		notifyCompletion(action.id, "completed")
	else
		logMsg("Failed: " .. tostring(error), "error")
		notifyCompletion(action.id, "failed", tostring(error))
	end
	
	ChangeHistoryService:SetWaypoint("Hideout Bot: " .. action.description)
end

-- Action Handlers
function createPart(data)
	local part = Instance.new(data.className or "Part")
	part.Name = data.name
	part.Size = Vector3.new(data.size[1], data.size[2], data.size[3])
	part.Position = Vector3.new(data.position[1], data.position[2], data.position[3])
	part.BrickColor = BrickColor.new(data.color or "Medium stone grey")
	part.Material = Enum.Material[data.material or "Plastic"]
	part.Anchored = data.anchored ~= false
	
	local parent = getOrCreatePath(data.parent or "Workspace")
	part.Parent = parent
end

function createScript(data)
	local scriptInstance
	if data.scriptType == "LocalScript" then
		scriptInstance = Instance.new("LocalScript")
	elseif data.scriptType == "ModuleScript" then
		scriptInstance = Instance.new("ModuleScript")
	else
		scriptInstance = Instance.new("Script")
	end
	
	scriptInstance.Name = data.name
	scriptInstance.Source = data.code
	
	local parent = getOrCreatePath(data.parent)
	scriptInstance.Parent = parent
end

function createModel(data)
	local model = Instance.new("Model")
	model.Name = data.name
	
	if data.primaryPart then
		local primaryPart = Instance.new("Part")
		primaryPart.Name = "PrimaryPart"
		primaryPart.Size = Vector3.new(1, 1, 1)
		primaryPart.Transparency = 1
		primaryPart.CanCollide = false
		primaryPart.Anchored = true
		primaryPart.Parent = model
		model.PrimaryPart = primaryPart
	end
	
	local parent = getOrCreatePath(data.parent or "Workspace")
	model.Parent = parent
	
	if data.children then
		for _, childData in ipairs(data.children) do
			processAction({
				type = childData.type,
				data = childData,
				description = "Creating child: " .. childData.name
			})
		end
	end
end

function createFolder(data)
	local folder = Instance.new("Folder")
	folder.Name = data.name
	local parent = getOrCreatePath(data.parent or "Workspace")
	folder.Parent = parent
end

function modifyProperties(data)
	local object = getOrCreatePath(data.path)
	if object then
		for property, value in pairs(data.properties or {}) do
			pcall(function()
				if property == "Position" or property == "Size" then
					object[property] = Vector3.new(value[1], value[2], value[3])
				elseif property == "Color" or property == "Color3" then
					object[property] = Color3.new(value[1], value[2], value[3])
				elseif property == "CFrame" then
					object[property] = CFrame.new(value[1], value[2], value[3])
				else
					object[property] = value
				end
			end)
		end
	end
end

function generateTerrain(data)
	local terrain = workspace.Terrain
	
	if data.clear then
		terrain:Clear()
	end
	
	if data.generate then
		-- Generate terrain based on parameters
		local region = Region3.new(
			Vector3.new(data.region.min[1], data.region.min[2], data.region.min[3]),
			Vector3.new(data.region.max[1], data.region.max[2], data.region.max[3])
		)
		region = region:ExpandToGrid(4)
		
		local material = Enum.Material[data.material or "Grass"]
		terrain:FillRegion(region, 4, material)
	end
end

function createUI(data)
	local screenGui = Instance.new("ScreenGui")
	screenGui.Name = data.name or "HideoutBotUI"
	screenGui.ResetOnSpawn = false
	
	local parent = game:GetService(data.service or "StarterGui")
	screenGui.Parent = parent
	
	if data.elements then
		for _, element in ipairs(data.elements) do
			createUIElement(element, screenGui)
		end
	end
end

function createUIElement(data, parent)
	local element = Instance.new(data.className)
	
	for prop, value in pairs(data.properties or {}) do
		if prop == "Size" or prop == "Position" then
			element[prop] = UDim2.new(value[1], value[2], value[3], value[4])
		elseif prop == "BackgroundColor3" or prop == "TextColor3" then
			element[prop] = Color3.new(value[1], value[2], value[3])
		else
			element[prop] = value
		end
	end
	
	element.Parent = parent
	
	if data.children then
		for _, child in ipairs(data.children) do
			createUIElement(child, element)
		end
	end
end

function setupLighting(data)
	local lighting = game:GetService("Lighting")
	
	for property, value in pairs(data) do
		if property == "Ambient" or property == "OutdoorAmbient" or property == "ColorShift_Bottom" or property == "ColorShift_Top" then
			lighting[property] = Color3.new(value[1], value[2], value[3])
		elseif property == "SunAngularSize" then
			lighting.SunAngularSize = value
		else
			pcall(function()
				lighting[property] = value
			end)
		end
	end
end

-- Helper Functions
function getOrCreatePath(path)
	local parts = string.split(path, ".")
	local current = game
	
	for i, part in ipairs(parts) do
		if i == 1 then
			-- First part should be a service
			current = game:GetService(part) or workspace:FindFirstChild(part)
		else
			local child = current:FindFirstChild(part)
			if not child then
				-- Create folder if it doesn't exist
				child = Instance.new("Folder")
				child.Name = part
				child.Parent = current
			end
			current = child
		end
	end
	
	return current
end

notifyCompletion = function(actionId, status, error)
	pcall(function()
		HttpService:PostAsync(
			API_URL .. "/api/plugin/complete/" .. actionId,
			HttpService:JSONEncode({
				status = status,
				error = error,
				projectId = projectId
			}),
			Enum.HttpContentType.ApplicationJson
		)
	end)
end

-- Plugin Button Handler
connectButton.Click:Connect(function()
	if pluginGui then
		pluginGui.Enabled = not pluginGui.Enabled
	else
		_G.HideoutBotLog = createGUI()
		pluginGui.Enabled = true
	end
end)

-- Initialize
print("🏝️ Hideout Bot Plugin v2.0.0 Loaded")
print("Click the Hideout Bot button in your plugins toolbar to get started!")
