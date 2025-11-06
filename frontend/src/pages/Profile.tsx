import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaKey, 
  FaPlug, 
  FaDownload, 
  FaCheck, 
  FaTimes,
  FaCrown,
  FaCoins,
  FaClock,
  FaAws,
  FaCopy
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { supabase } from '../lib/supabase';
import ChangeEmailModal from '../components/ChangeEmailModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import toast from 'react-hot-toast';
import '../styles/profile.css';

const Profile: React.FC = () => {
  const { user: authUser } = useAuth();
  const { pluginConnected } = useWebSocket();
  const [awsCredentials, setAwsCredentials] = useState({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
  });
  const [awsConnected, setAwsConnected] = useState(false);
  const [showAwsForm, setShowAwsForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (!authUser) return <div>Loading...</div>;

  const user = {
    name: authUser.username,
    email: authUser.email,
    avatar: authUser.avatar_url || '👤',
    apiKey: authUser.apiKey || 'Loading...',
    plan: 'Pro',
    promptBalance: authUser.prompt_balance,
    resetTime: calculateResetTime(authUser.reset_time),
    pluginConnected: pluginConnected,
  };

  function calculateResetTime(resetTime: Date): string {
    const now = new Date();
    const diff = resetTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  const handleAwsConnect = async () => {
    if (awsCredentials.accessKeyId && awsCredentials.secretAccessKey) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error('Please log in again');
          return;
        }

        const API_URL = import.meta.env.VITE_API_URL || 'https://www.hideoutbot.lol';
        const response = await fetch(`${API_URL}/api/user/aws-credentials`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(awsCredentials),
        });

        if (!response.ok) {
          throw new Error('Failed to save credentials');
        }

        setAwsConnected(true);
        setShowAwsForm(false);
        toast.success('AWS credentials saved securely!');
      } catch (error) {
        console.error('Error saving AWS credentials:', error);
        toast.error('Failed to save AWS credentials');
      }
    }
  };

  const handleDownloadPlugin = () => {
    // Download the actual plugin file
    const link = document.createElement('a');
    link.href = '/plugin/HideoutBot_v2.lua';
    link.download = 'HideoutBot.lua';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyApiKey = () => {
    if (user.apiKey && user.apiKey !== 'Loading...') {
      navigator.clipboard.writeText(user.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-emoji">{user.avatar}</span>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          <div className="profile-badge">
            <FaCrown className="badge-icon" />
            <span>{user.plan} Plan</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <FaCoins className="stat-icon" />
          </div>
          <div className="stat-details">
            <span className="stat-label">Prompt Balance</span>
            <span className="stat-value">{user.promptBalance}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <FaClock className="stat-icon" />
          </div>
          <div className="stat-details">
            <span className="stat-label">Resets In</span>
            <span className="stat-value">{user.resetTime}</span>
          </div>
        </div>

        <div className={`stat-card ${user.pluginConnected ? 'connected' : 'disconnected'}`}>
          <div className="stat-icon-wrapper">
            <FaPlug className="stat-icon" />
          </div>
          <div className="stat-details">
            <span className="stat-label">Plugin Status</span>
            <span className="stat-value">
              {user.pluginConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="status-indicator"></div>
        </div>
      </div>

      {/* Sections */}
      <div className="profile-sections">
        {/* Plugin Section */}
        <motion.div 
          className="section-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="section-header">
            <FaPlug className="section-icon" />
            <h2 className="section-title">Roblox Studio Plugin</h2>
          </div>

          <p className="section-description">
            Download and install the Hideout Bot plugin to sync your AI-generated content directly to Roblox Studio.
          </p>

          <div className="api-key-section">
            <label className="form-label">🔑 Your API Key</label>
            <div className="api-key-display">
              <code className="api-key-code">{user.apiKey}</code>
              <motion.button
                className="copy-btn"
                onClick={copyApiKey}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? <FaCheck /> : <FaCopy />}
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>
            <p className="api-key-hint">Copy this key and paste it into the Roblox Studio plugin</p>
          </div>

          <div className="plugin-status">
            {user.pluginConnected ? (
              <div className="status-message success">
                <FaCheck className="status-icon" />
                <span>Plugin connected and syncing</span>
              </div>
            ) : (
              <div className="status-message error">
                <FaTimes className="status-icon" />
                <span>Plugin not connected</span>
              </div>
            )}
          </div>

          <motion.button
            className="action-btn primary"
            onClick={handleDownloadPlugin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaDownload className="btn-icon" />
            Download Plugin
          </motion.button>

          <div className="info-box">
            <strong>Setup Instructions:</strong>
            <ol className="instructions-list">
              <li>Click "Download Plugin" above to get the HideoutBot.lua file</li>
              <li>Open Roblox Studio</li>
              <li>Go to <strong>PLUGINS</strong> tab → <strong>Plugins Folder</strong> button</li>
              <li>Drag the HideoutBot.lua file into the plugins folder</li>
              <li>Restart Roblox Studio</li>
              <li>Click the <strong>🏝️ Hideout Bot</strong> button in the toolbar</li>
              <li>Copy your API Key from above and paste it into the plugin</li>
              <li>Enter your Project ID and click Connect</li>
            </ol>
          </div>
        </motion.div>

        {/* AWS Integration Section */}
        <motion.div 
          className="section-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="section-header">
            <FaAws className="section-icon aws" />
            <h2 className="section-title">AWS Integration</h2>
          </div>

          <p className="section-description">
            Connect your AWS account to use Claude 4 or 4.5 with your own Bedrock credentials. You'll have full control over billing and usage.
          </p>

          <div className="aws-status">
            {awsConnected ? (
              <div className="status-message success">
                <FaCheck className="status-icon" />
                <span>AWS credentials configured</span>
              </div>
            ) : (
              <div className="status-message info">
                <FaKey className="status-icon" />
                <span>No AWS credentials configured</span>
              </div>
            )}
          </div>

          {!showAwsForm ? (
            <button
              className="action-btn secondary"
              onClick={() => setShowAwsForm(true)}
            >
              <FaKey className="btn-icon" />
              {awsConnected ? 'Update' : 'Configure'} AWS Credentials
            </button>
          ) : (
            <div className="aws-form">
              <div className="form-group">
                <label className="form-label">AWS Access Key ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  value={awsCredentials.accessKeyId}
                  onChange={(e) => setAwsCredentials({ ...awsCredentials, accessKeyId: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">AWS Secret Access Key</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                  value={awsCredentials.secretAccessKey}
                  onChange={(e) => setAwsCredentials({ ...awsCredentials, secretAccessKey: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">AWS Region</label>
                <select
                  className="form-input"
                  value={awsCredentials.region}
                  onChange={(e) => setAwsCredentials({ ...awsCredentials, region: e.target.value })}
                >
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="us-west-2">US West (Oregon)</option>
                  <option value="eu-west-1">EU (Ireland)</option>
                  <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  className="action-btn tertiary"
                  onClick={() => setShowAwsForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="action-btn primary"
                  onClick={handleAwsConnect}
                  disabled={!awsCredentials.accessKeyId || !awsCredentials.secretAccessKey}
                >
                  <FaCheck className="btn-icon" />
                  Save Credentials
                </button>
              </div>
            </div>
          )}

          <div className="info-box">
            <strong>🔒 Security Note:</strong>
            <p>Your AWS credentials are encrypted and stored securely. We never access your AWS resources without your explicit permission.</p>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div 
          className="section-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="section-header">
            <FaUser className="section-icon" />
            <h2 className="section-title">Account Settings</h2>
          </div>

          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Email</h4>
                <p>{user.email}</p>
              </div>
              <button className="setting-btn" onClick={() => setShowEmailModal(true)}>Change</button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Password</h4>
                <p>••••••••</p>
              </div>
              <button className="setting-btn" onClick={() => setShowPasswordModal(true)}>Update</button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Plan</h4>
                <p>{user.plan} Plan - 100 prompts/day</p>
              </div>
              <button className="setting-btn primary" onClick={() => toast('Upgrade feature coming soon!', { icon: '🚀' })}>Upgrade</button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <ChangeEmailModal 
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        currentEmail={user.email}
      />
      <ChangePasswordModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default Profile;
