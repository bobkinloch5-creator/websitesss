-- Hideout Bot Plugin v1.0.0
local HttpService = game:GetService("HttpService")
local InsertService = game:GetService("InsertService")
local ChangeHistoryService = game:GetService("ChangeHistoryService")
local Players = game:GetService("Players")

-- Backend URL
local API_URL = "https://hideoutbot.lol"
local POLL_INTERVAL = 3

local toolbar = plugin:CreateToolbar("Hideout Bot")
local connectButton = toolbar:CreateButton("Connect","Connect to Hideout Bot","rbxassetid://4458901886")
local pluginGui = nil
local apiKey = ""
local isConnected = false
local logMessage = function() end

local function createGUI()
	local info = DockWidgetPluginGuiInfo.new(
		Enum.InitialDockState.Float,
		false,
		false,
		350,
		420,
		300,
		200
	)
	pluginGui = plugin:CreateDockWidgetPluginGui("HideoutBotWidget", info)
	pluginGui.Title = "Hideout Bot AI"

	local mainFrame = Instance.new("Frame")
	mainFrame.Size = UDim2.new(1, 0, 1, 0)
	mainFrame.BackgroundColor3 = Color3.fromRGB(40, 30, 60)
	mainFrame.Parent = pluginGui

	local title = Instance.new("TextLabel")
	title.Size = UDim2.new(1, -20, 0, 40)
	title.Position = UDim2.new(0, 10, 0, 10)
	title.Text = "🤖 Hideout Bot"
	title.TextColor3 = Color3.fromRGB(180, 120, 255)
	title.TextSize = 22
	title.Font = Enum.Font.GothamBold
	title.BackgroundTransparency = 1
	title.Parent = mainFrame

	local apiKeyLabel = Instance.new("TextLabel")
	apiKeyLabel.Size = UDim2.new(1, -20, 0, 20)
	apiKeyLabel.Position = UDim2.new(0, 10, 0, 60)
	apiKeyLabel.Text = "API Key:"
	apiKeyLabel.TextColor3 = Color3.fromRGB(200, 200, 255)
	apiKeyLabel.TextSize = 14
	apiKeyLabel.TextXAlignment = Enum.TextXAlignment.Left
	apiKeyLabel.BackgroundTransparency = 1
	apiKeyLabel.Parent = mainFrame

	local apiKeyInput = Instance.new("TextBox")
	apiKeyInput.Size = UDim2.new(1, -20, 0, 30)
	apiKeyInput.Position = UDim2.new(0, 10, 0, 85)
	apiKeyInput.PlaceholderText = "Enter your API key from hideoutbot.lol"
	apiKeyInput.Text = plugin:GetSetting("HideoutBot_APIKey") or ""
	apiKeyInput.TextColor3 = Color3.fromRGB(255,255,255)
	apiKeyInput.BackgroundColor3 = Color3.fromRGB(60, 40, 120)
	apiKeyInput.BorderSizePixel = 0
	apiKeyInput.TextSize = 12
	apiKeyInput.Font = Enum.Font.Code
	apiKeyInput.Parent = mainFrame

	local connectBtn = Instance.new("TextButton")
	connectBtn.Size = UDim2.new(1, -20, 0, 40)
	connectBtn.Position = UDim2.new(0, 10, 0, 125)
	connectBtn.Text = "🔗 Connect to AI"
	connectBtn.TextColor3 = Color3.fromRGB(255,255,255)
	connectBtn.BackgroundColor3 = Color3.fromRGB(120, 60, 255)
	connectBtn.TextSize = 16
	connectBtn.Font = Enum.Font.GothamBold
	connectBtn.BorderSizePixel = 0
	connectBtn.Parent = mainFrame

	local statusLabel = Instance.new("TextLabel")
	statusLabel.Size = UDim2.new(1, -20, 0, 30)
	statusLabel.Position = UDim2.new(0, 10, 0, 175)
	statusLabel.Text = "⚪ Disconnected"
	statusLabel.TextColor3 = Color3.fromRGB(180, 180, 200)
	statusLabel.TextSize = 14
	statusLabel.BackgroundTransparency = 1
	statusLabel.Parent = mainFrame

	local logFrame = Instance.new("ScrollingFrame")
	logFrame.Size = UDim2.new(1, -20, 1, -220)
	logFrame.Position = UDim2.new(0, 10, 0, 210)
	logFrame.BackgroundColor3 = Color3.fromRGB(30, 20, 50)
	logFrame.BorderSizePixel = 0
	logFrame.ScrollBarThickness = 6
	logFrame.CanvasSize = UDim2.new(0, 0, 0, 0)
	logFrame.Parent = mainFrame

	local logLayout = Instance.new("UIListLayout")
	logLayout.Padding = UDim.new(0, 5)
	logLayout.Parent = logFrame
	logLayout:GetPropertyChangedSignal("AbsoluteContentSize"):Connect(function()
		logFrame.CanvasSize = UDim2.new(0, 0, 0, logLayout.AbsoluteContentSize.Y + 10)
	end)

	function logMessage(message, color)
		local logEntry = Instance.new("TextLabel")
		logEntry.Size = UDim2.new(1, -10, 0, 20)
		logEntry.Text = os.date("[%H:%M:%S] ") .. message
		logEntry.TextColor3 = color or Color3.fromRGB(255,255,255)
		logEntry.TextSize = 11
		logEntry.Font = Enum.Font.Code
		logEntry.TextXAlignment = Enum.TextXAlignment.Left
		logEntry.BackgroundTransparency = 1
		logEntry.TextWrapped = true
		logEntry.Parent = logFrame
		logFrame.CanvasPosition = Vector2.new(0, logLayout.AbsoluteContentSize.Y)
	end

	connectBtn.MouseButton1Click:Connect(function()
		apiKey = apiKeyInput.Text
		if apiKey ~= "" then
			plugin:SetSetting("HideoutBot_APIKey", apiKey)
			local success, result = pcall(function()
				return HttpService:GetAsync(API_URL .. "/api/auth/verify-plugin?key=" .. apiKey)
			end)
			if success then
				local data = HttpService:JSONDecode(result)
				if data.valid then
					isConnected = true
					statusLabel.Text = "🟢 Connected - " .. data.email
					statusLabel.TextColor3 = Color3.fromRGB(0,255,0)
					connectBtn.Text = "✅ Connected"
					logMessage("Connected successfully!", Color3.fromRGB(0,255,0))
					startPolling()
				else
					logMessage("Invalid API key", Color3.fromRGB(255,0,0))
				end
			else
				logMessage("Connection failed: " .. tostring(result), Color3.fromRGB(255,0,0))
			end
		end
	end)
end

function startPolling()
	spawn(function()
		while isConnected do
			local success, result = pcall(function()
				return HttpService:GetAsync(API_URL .. "/api/plugin/actions/" .. apiKey)
			end)
			if success then
				local data = HttpService:JSONDecode(result)
				if data.actions and #data.actions > 0 then
					for _, action in ipairs(data.actions) do
						processAction(action)
					end
				end
			end
			wait(POLL_INTERVAL)
		end
	end)
end

function processAction(action)
	logMessage("📥 Received: " .. action.description, Color3.fromRGB(100,200,255))
	local success, error = pcall(function()
		if action.type == "insert_model" then
			insertModel(action.data)
		elseif action.type == "create_script" then
			createScript(action.data)
		elseif action.type == "modify_terrain" then
			modifyTerrain(action.data)
		elseif action.type == "set_lighting" then
			setLighting(action.data)
		elseif action.type == "create_ui" then
			createUI(action.data)
		end
	end)
	if success then
		logMessage("✅ Completed: " .. action.description, Color3.fromRGB(0,255,0))
		notifyCompletion(action.id, "completed")
	else
		logMessage("❌ Failed: " .. tostring(error), Color3.fromRGB(255,0,0))
		notifyCompletion(action.id, "failed", tostring(error))
	end
	ChangeHistoryService:SetWaypoint("Hideout Bot: " .. action.description)
end

function insertModel(data)
	local model = InsertService:LoadAsset(data.assetId)
	if model then
		local primaryPart = model:FindFirstChildWhichIsA("BasePart", true)
		if primaryPart then
			model:MoveTo(Vector3.new(unpack(data.position)))
			model.Parent = workspace
		end
	end
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
	local parent = findPath(data.parent) or workspace
	scriptInstance.Parent = parent
end

function modifyTerrain(data)
	local terrain = workspace.Terrain
	local region = Region3.new(
		Vector3.new(unpack(data.region.center)) - Vector3.new(unpack(data.region.size))/2,
		Vector3.new(unpack(data.region.center)) + Vector3.new(unpack(data.region.size))/2
	)
	local material = Enum.Material[data.material]
	if data.operation == "add" then
		terrain:FillRegion(region, 4, material)
	else
		terrain:FillRegion(region, 4, Enum.Material.Air)
	end
end

function setLighting(data)
	local lighting = game:GetService("Lighting")
	for property, value in pairs(data) do
		if property == "Ambient" or property == "OutdoorAmbient" or property == "FogColor" then
			lighting[property] = Color3.new(unpack(value))
		else
			lighting[property] = value
		end
	end
end

function createUI(data)
	local screenGui = Instance.new("ScreenGui")
	screenGui.Name = "HideoutBotUI"
	screenGui.ResetOnSpawn = false
	screenGui.Parent = game:GetService("StarterGui")
	
	local element = Instance.new(data.uiType)
	for prop, value in pairs(data.properties) do
		if prop == "Size" or prop == "Position" then
			local x1, x2, y1, y2 = value:match("{([^,]+),([^}]+)},{([^,]+),([^}]+)}")
			element[prop] = UDim2.new(tonumber(x1), tonumber(x2), tonumber(y1), tonumber(y2))
		elseif prop == "BackgroundColor3" or prop == "TextColor3" then
			element[prop] = Color3.new(unpack(value))
		else
			element[prop] = value
		end
	end
	element.Parent = screenGui
	
	if data.script then
		local script = Instance.new("LocalScript")
		script.Source = data.script
		script.Parent = element
	end
end

function findPath(path)
	local parts = string.split(path, ".")
	local current = game
	for _, part in ipairs(parts) do
		current = current:FindFirstChild(part)
		if not current then return nil end
	end
	return current
end

function notifyCompletion(actionId, status, error)
	pcall(function()
		HttpService:PostAsync(
			API_URL .. "/api/plugin/complete/" .. actionId,
			HttpService:JSONEncode({
				status = status,
				error = error
			}),
			Enum.HttpContentType.ApplicationJson
		)
	end)
end

connectButton.Click:Connect(function()
	if pluginGui then
		pluginGui.Enabled = not pluginGui.Enabled
	else
		createGUI()
		pluginGui.Enabled = true
	end
end)

print("✅ Hideout Bot Plugin Loaded v1.0.0")
