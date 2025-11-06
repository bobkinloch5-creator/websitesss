import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  socket: Socket | null;
  connected: boolean;
  pluginConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [pluginConnected, setPluginConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // Disconnect socket if user logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
        setPluginConnected(false);
      }
      return;
    }

    // Connect to WebSocket when user is authenticated
    const newSocket = io(import.meta.env.VITE_API_URL || 'https://www.hideoutbot.lol', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
      
      // Authenticate with the server
      if (user.apiKey) {
        newSocket.emit('authenticate', {
          apiKey: user.apiKey,
          userId: user.id,
        });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setConnected(false);
      setPluginConnected(false);
    });

    newSocket.on('authenticated', (data) => {
      console.log('✅ Authenticated with server:', data.message);
    });

    // Listen for plugin connection status
    newSocket.on('plugin_connected', () => {
      console.log('🔌 Plugin connected');
      setPluginConnected(true);
    });

    newSocket.on('plugin_disconnected', () => {
      console.log('🔌 Plugin disconnected');
      setPluginConnected(false);
    });

    // Listen for plugin heartbeats
    newSocket.on('plugin_heartbeat', () => {
      setPluginConnected(true);
    });

    // Listen for action completion updates
    newSocket.on('action_completed', (data) => {
      console.log('✅ Action completed:', data);
    });

    newSocket.on('action_failed', (data) => {
      console.error('❌ Action failed:', data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <WebSocketContext.Provider value={{ socket, connected, pluginConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error('useWebSocket must be used within WebSocketProvider');
  return context;
};
