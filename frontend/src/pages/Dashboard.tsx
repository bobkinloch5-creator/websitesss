import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaSync, FaCheck, FaTimes, FaClock, FaFolder, FaCopy, FaKey } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import '../styles/dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'https://www.hideoutbot.lol';

interface Project {
  id: string;
  name: string;
  status: 'synced' | 'syncing' | 'disconnected';
  lastUpdated: string;
  fileCount: number;
  recentChanges: string[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { pluginConnected } = useWebSocket();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedApi, setCopiedApi] = useState(false);

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend endpoint is ready
      // For now, show sample data if user exists
      setProjects([
        {
          id: '1',
          name: 'My First Game',
          status: pluginConnected ? 'synced' : 'disconnected',
          lastUpdated: '2 minutes ago',
          fileCount: 24,
          recentChanges: ['Welcome to Hideout Bot!'],
        },
      ]);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (newProjectName.trim()) {
      try {
        // TODO: Replace with actual API call when backend endpoint is ready
        const newProject: Project = {
          id: Date.now().toString(),
          name: newProjectName,
          status: 'disconnected',
          lastUpdated: 'Just now',
          fileCount: 0,
          recentChanges: ['Project created'],
        };
        setProjects([...projects, newProject]);
        setNewProjectName('');
        setShowNewProjectModal(false);
        toast.success('Project created successfully!');
      } catch (error) {
        toast.error('Failed to create project');
      }
    }
  };

  const copyApiKey = () => {
    if (user?.apiKey) {
      navigator.clipboard.writeText(user.apiKey);
      setCopiedApi(true);
      toast.success('API key copied!');
      setTimeout(() => setCopiedApi(false), 2000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <FaCheck className="status-icon synced" />;
      case 'syncing':
        return <FaSync className="status-icon syncing spin" />;
      case 'disconnected':
        return <FaTimes className="status-icon disconnected" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'synced':
        return 'Synced';
      case 'syncing':
        return 'Syncing...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return '';
    }
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">
            <span className="emoji">📁</span>
            Your Projects
          </h1>
          <p className="page-subtitle">Manage and sync your Roblox game projects</p>
        </div>

        <motion.button
          className="new-project-btn"
          onClick={() => setShowNewProjectModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus className="btn-icon" />
          New Project
        </motion.button>
      </div>

      {/* API Credentials Section */}
      {user?.apiKey && (
        <motion.div 
          className="api-credentials-card"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            color: 'white',
            boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FaKey size={24} />
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Your API Key</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                  Use this key to connect your Roblox Studio plugin
                </p>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              background: pluginConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              {pluginConnected ? <FaCheck /> : <FaTimes />}
              {pluginConnected ? 'Plugin Connected' : 'Plugin Offline'}
            </div>
          </div>
          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <code style={{
              fontFamily: 'monospace',
              fontSize: '16px',
              letterSpacing: '0.5px',
              wordBreak: 'break-all',
            }}>
              {user.apiKey}
            </code>
            <motion.button
              onClick={copyApiKey}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                marginLeft: '16px',
                flexShrink: 0,
              }}
            >
              {copiedApi ? <FaCheck /> : <FaCopy />}
              {copiedApi ? 'Copied!' : 'Copy'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="project-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            {/* Project Header */}
            <div className="project-header">
              <div className="project-info">
                <FaFolder className="project-icon" />
                <h3 className="project-name">{project.name}</h3>
              </div>
              <div className={`project-status ${project.status}`}>
                {getStatusIcon(project.status)}
                <span>{getStatusText(project.status)}</span>
              </div>
            </div>

            {/* Project Stats */}
            <div className="project-stats">
              <div className="stat">
                <span className="stat-label">Files</span>
                <span className="stat-value">{project.fileCount}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Last Updated</span>
                <span className="stat-value">
                  <FaClock className="stat-icon" />
                  {project.lastUpdated}
                </span>
              </div>
            </div>

            {/* Recent Changes */}
            <div className="recent-changes">
              <h4 className="changes-title">Recent Changes</h4>
              <ul className="changes-list">
                {project.recentChanges.map((change, idx) => (
                  <li key={idx} className="change-item">
                    <span className="change-dot"></span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="project-actions">
              <button className="action-btn primary">Open in Chat</button>
              <button className="action-btn secondary">View Files</button>
            </div>
          </motion.div>
        ))}

        {/* Empty State */}
        {projects.length === 0 && (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-icon">📦</div>
            <h3>No projects yet</h3>
            <p>Create your first project to get started!</p>
            <button 
              className="empty-btn"
              onClick={() => setShowNewProjectModal(true)}
            >
              <FaPlus /> Create Project
            </button>
          </motion.div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowNewProjectModal(false)}
        >
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-title">
              <span className="emoji">✨</span>
              Create New Project
            </h2>
            <p className="modal-subtitle">Give your Roblox game a name</p>

            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., My Awesome Game"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              />
            </div>

            <div className="modal-actions">
              <button 
                className="modal-btn cancel"
                onClick={() => setShowNewProjectModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-btn create"
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
              >
                <FaPlus /> Create Project
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
