const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const supabase = require('./config/supabase');

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = [
  'https://www.hideoutbot.lol',
  'https://hideoutbot.lol',
  'http://localhost:3000', // For local development
  'http://localhost:5173'  // Vite default port
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or Roblox)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.FRONTEND_URL === origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Socket.io with CORS
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Test Supabase connection
const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows (which is fine)
      throw error;
    }
    console.log('✅ Supabase Connected Successfully');
    return true;
  } catch (error) {
    console.error('❌ Supabase Connection Error:', error.message);
    return false;
  }
};

testSupabaseConnection();

// Make io available to routes
app.set('io', io);

// Socket.io connection handling
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  socket.on('authenticate', (data) => {
    const { apiKey, userId, isPlugin } = data;
    connectedUsers.set(apiKey, socket.id);
    socket.join(`user_${apiKey}`);
    socket.join(`user_id_${userId}`);
    console.log(`✅ User authenticated: ${userId} (${apiKey.substring(0, 8)}...)`);
    
    if (isPlugin) {
      // This is the Roblox plugin connecting
      console.log('🎮 Roblox plugin connected');
      // Notify the web client that plugin is connected
      io.to(`user_${apiKey}`).emit('plugin_connected', {
        message: 'Roblox plugin is now connected',
        timestamp: Date.now()
      });
    }
    
    socket.emit('authenticated', { 
      success: true, 
      message: 'Connected to Hideout Bot' 
    });
  });

  socket.on('plugin_heartbeat', (data) => {
    const { apiKey } = data;
    socket.emit('heartbeat_ack', { timestamp: Date.now() });
    // Also notify web clients that plugin is still connected
    if (apiKey) {
      io.to(`user_${apiKey}`).emit('plugin_heartbeat', { timestamp: Date.now() });
    }
  });
  
  socket.on('disconnect', () => {
    // Remove from connected users
    for (let [key, value] of connectedUsers.entries()) {
      if (value === socket.id) {
        connectedUsers.delete(key);
        console.log(`❌ User disconnected: ${key.substring(0, 8)}...`);
        break;
      }
    }
    console.log('❌ Client disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const supabaseConnected = await testSupabaseConnection();
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: supabaseConnected ? 'connected' : 'disconnected',
    connectedClients: io.engine.clientsCount
  });
});

// Alias to match frontend expectation
app.get('/api/health', async (req, res) => {
  const supabaseConnected = await testSupabaseConnection();
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: supabaseConnected ? 'connected' : 'disconnected',
    connectedClients: io.engine.clientsCount
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/prompts', require('./routes/prompts'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/plugin', require('./routes/plugin'));
app.use('/api/user', require('./routes/user'));
app.use('/api/chat', require('./routes/chat'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗\n║   🤖 HIDEOUT BOT SERVER RUNNING 🤖    ║\n╠════════════════════════════════════════╣\n║  Port: ${PORT.toString().padEnd(31)}║\n║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(23)}║\n║  Database: Supabase                    ║\n║  Socket.io: Active                     ║\n╚════════════════════════════════════════╝\n  `);
});

module.exports = { app, server, io };
