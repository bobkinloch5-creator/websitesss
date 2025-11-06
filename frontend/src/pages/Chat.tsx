import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser, FaLightbulb, FaCheck, FaClock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import axios from 'axios';
import '../styles/chat.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://www.hideoutbot.lol';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'plan';
  content: string;
  timestamp: Date;
  options?: PlanOption[];
}

interface PlanOption {
  id: string;
  label: string;
  description: string;
  preview?: string;
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const { socket, pluginConnected } = useWebSocket();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hey! 👋 I\'m your AI assistant. I can help you build complete Roblox games. Just describe what you want to create!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptBalance = user?.prompt_balance || 0;
  const resetTimer = user?.reset_time ? calculateResetTime(user.reset_time) : '24h';

  function calculateResetTime(resetTime: Date): string {
    const now = new Date();
    const diff = resetTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || !user) return;

    // Use selected project or default
    const projectId = selectedProjectId || 'default-project';

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const promptText = input;
    setInput('');
    setLoading(true);

    try {
      // Send prompt to backend - this creates actions that the plugin will pick up
      const response = await axios.post(
        `${API_URL}/api/prompts/create`,
        {
          prompt: promptText,
          projectId: projectId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // Add auth header if you have token-based auth
          },
          withCredentials: true,
        }
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `✅ Got it! I'm building that now in your Roblox project. ${pluginConnected ? 'Your plugin will start executing in a few seconds!' : '⚠️ Connect your plugin to see the changes in Studio.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Notify via WebSocket for instant updates
      if (socket) {
        socket.emit('new_prompt', {
          projectId,
          promptId: response.data.id,
        });
      }
    } catch (error: any) {
      console.error('Error sending prompt:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `❌ Sorry, there was an error: ${error.response?.data?.error || error.message}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanMode = () => {
    const planMessage: Message = {
      id: Date.now().toString(),
      type: 'plan',
      content: 'Here are some options for your game:',
      timestamp: new Date(),
      options: [
        {
          id: 'a',
          label: 'Option A: Modern UI',
          description: 'Clean, minimalist interface with smooth animations',
          preview: '🎨 Modern design with gradient buttons and sleek cards',
        },
        {
          id: 'b',
          label: 'Option B: Retro Style',
          description: 'Pixel art aesthetic with nostalgic feel',
          preview: '🕹️ Classic 8-bit inspired design',
        },
        {
          id: 'c',
          label: 'Option C: Futuristic',
          description: 'Neon colors with cyberpunk vibes',
          preview: '🌃 Sci-fi themed with glowing elements',
        },
      ],
    };
    setMessages((prev) => [...prev, planMessage]);
  };

  const handleSelectOption = async (optionId: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Selected Option ${optionId.toUpperCase()}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send the selected option as a new prompt
    setInput(`Build Option ${optionId.toUpperCase()} from the previous plan`);
    setTimeout(() => handleSend(), 100);
  };

  // Listen for action completion events from WebSocket
  useEffect(() => {
    if (!socket) return;

    socket.on('action_completed', (data) => {
      const completionMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `✅ Completed: ${data.description || 'Action finished'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completionMessage]);
    });

    socket.on('action_failed', (data) => {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `❌ Failed: ${data.error || 'Unknown error'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    });

    return () => {
      socket.off('action_completed');
      socket.off('action_failed');
    };
  }, [socket]);

  return (
    <div className="chat-page">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-title">
          <FaRobot className="title-icon" />
          <div>
            <h1>AI Chat</h1>
            <p className="chat-status">
              <span className="status-dot active"></span>
              AI is ready
            </p>
          </div>
        </div>

        <div className="chat-stats">
          <div className="stat-card">
            <FaLightbulb className="stat-icon" />
            <div className="stat-info">
              <span className="stat-label">Prompt Balance</span>
              <span className="stat-value">{promptBalance}</span>
            </div>
          </div>
          <div className="stat-card">
            <FaClock className="stat-icon" />
            <div className="stat-info">
              <span className="stat-label">Resets in</span>
              <span className="stat-value">{resetTimer}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`message ${message.type}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Message Avatar */}
              <div className="message-avatar">
                {message.type === 'user' ? (
                  <FaUser className="avatar-icon" />
                ) : (
                  <FaRobot className="avatar-icon" />
                )}
              </div>

              {/* Message Content */}
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">
                    {message.type === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                
                <div className="message-text">{message.content}</div>

                {/* Plan Mode Options */}
                {message.options && (
                  <div className="plan-options">
                    {message.options.map((option) => (
                      <motion.div
                        key={option.id}
                        className="plan-option"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleSelectOption(option.id)}
                      >
                        <div className="option-header">
                          <span className="option-label">{option.label}</span>
                          <FaCheck className="option-icon" />
                        </div>
                        <p className="option-description">{option.description}</p>
                        {option.preview && (
                          <div className="option-preview">{option.preview}</div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {loading && (
          <motion.div 
            className="message ai loading-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="message-avatar">
              <FaRobot className="avatar-icon" />
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-container">
        <button 
          className="plan-mode-btn"
          onClick={handlePlanMode}
          title="Enable Plan Mode - Get multiple options"
        >
          <FaLightbulb />
          Plan Mode
        </button>

        <div className="chat-input-wrapper">
          <input
            type="text"
            className="chat-input"
            placeholder="Describe what you want to build..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <motion.button
            className="send-btn"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPaperPlane />
          </motion.button>
        </div>

        <div className="input-info">
          <span className="balance-info">
            💡 {promptBalance} prompts remaining
          </span>
          <span className="tip-info">
            💡 Tip: Use Plan Mode to see multiple design options
          </span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
