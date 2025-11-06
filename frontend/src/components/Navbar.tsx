import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaComments, 
  FaLayerGroup, 
  FaUser, 
  FaPlug,
  FaCoins 
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { pluginConnected } = useWebSocket();
  
  const promptBalance = user?.prompt_balance || 0;

  const navItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/chat', icon: FaComments, label: 'AI Chat' },
    { path: '/templates', icon: FaLayerGroup, label: 'Templates' },
    { path: '/docs', icon: FaLayerGroup, label: 'Docs' },
    { path: '/profile', icon: FaUser, label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-emoji">🏝️</span>
          <span className="logo-text">Hideout Bot</span>
        </Link>

        {/* Nav Links */}
        <div className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <motion.div
                    className="nav-indicator"
                    layoutId="navbar-indicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Status Badges and Legal Links */}
        <div className="navbar-status" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Prompt Balance */}
          <div className="status-badge balance-badge">
            <FaCoins className="badge-icon" />
            <span className="badge-text">{promptBalance} prompts</span>
          </div>

          {/* Plugin Status */}
          <div className={`status-badge plugin-badge ${pluginConnected ? 'connected' : 'disconnected'}`}>
            <FaPlug className="badge-icon" />
            <span className="badge-text">
              {pluginConnected ? 'Connected' : 'Disconnected'}
            </span>
            <div className="status-dot"></div>
          </div>

          {/* Legal Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8 }}>
            <Link to="/terms" className="nav-link" style={{ fontSize: 12, opacity: 0.85 }}>Terms</Link>
            <Link to="/copyright" className="nav-link" style={{ fontSize: 12, opacity: 0.85 }}>Copyright</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
