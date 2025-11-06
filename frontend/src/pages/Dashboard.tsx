import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaSync, FaCheck, FaTimes, FaClock, FaFolder } from 'react-icons/fa';
import '../styles/dashboard.css';

interface Project {
  id: string;
  name: string;
  status: 'synced' | 'syncing' | 'disconnected';
  lastUpdated: string;
  fileCount: number;
  recentChanges: string[];
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Lemonade',
      status: 'synced',
      lastUpdated: '2 minutes ago',
      fileCount: 24,
      recentChanges: ['Added UI script', 'Updated player controller', 'Created terrain'],
    },
    {
      id: '2',
      name: 'Superbullet AI',
      status: 'syncing',
      lastUpdated: 'Just now',
      fileCount: 18,
      recentChanges: ['Generating weapon system...'],
    },
  ]);

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
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
