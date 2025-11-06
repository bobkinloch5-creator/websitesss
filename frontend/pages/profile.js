import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const [awsAccessKey, setAwsAccessKey] = useState('');
  const [awsSecretKey, setAwsSecretKey] = useState('');
  const [awsRegion, setAwsRegion] = useState('us-east-1');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  // Set client flag first
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to login if not authenticated - only on client
  useEffect(() => {
    if (!isClient) return;
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isClient, authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      // Set profile data from auth context user
      setProfileData({
        username: user.email?.split('@')[0] || 'User',
        email: user.email,
        promptBalance: user.promptsRemaining || 100,
        resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        awsConfigured: false,
        pluginConnected: true,
        apiKey: user.apiKey
      });
    }
  }, [user]);

  const saveAwsCredentials = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess('AWS credentials saved successfully!');
      setAwsAccessKey('');
      setAwsSecretKey('');
      setProfileData(prev => ({ ...prev, awsConfigured: true }));
    } catch (err) {
      setError('Failed to save AWS credentials');
    } finally {
      setLoading(false);
    }
  };

  const downloadPlugin = () => {
    // This would trigger the actual plugin download
    window.open('/api/plugin/download', '_blank');
  };

  // Show loading state while checking auth
  if (authLoading || !profileData) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    );
  }

  // Don't render profile if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="profile-container">
        <h1 className="profile-title">⚙️ Profile & Settings</h1>

        {/* User Stats Section */}
        <div className="profile-section">
          <h2 className="section-title">📊 Your Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Username</div>
              <div className="stat-value">{profileData.username}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Email</div>
              <div className="stat-value">{profileData.email}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Prompt Balance</div>
              <div className="stat-value gradient-text">⚡ {profileData.promptBalance}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Reset Time</div>
              <div className="stat-value">🕐 {profileData.resetTime.toLocaleTimeString()}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Plugin Status</div>
              <div className={`status-badge ${profileData.pluginConnected ? 'connected' : 'disconnected'}`}>
                {profileData.pluginConnected ? '✅ Connected' : '❌ Disconnected'}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">AWS Status</div>
              <div className={`status-badge ${profileData.awsConfigured ? 'connected' : 'disconnected'}`}>
                {profileData.awsConfigured ? '✅ Configured' : '❌ Not Configured'}
          </div>
          {profileData.apiKey && (
            <div className="stat-card full-width">
              <div className="stat-label">API Key</div>
              <div className="api-key-value">
                <code>{profileData.apiKey}</code>
                <button className="copy-btn" onClick={() => navigator.clipboard.writeText(profileData.apiKey)}>
                  📋 Copy
                </button>
              </div>
            </div>
          )}
        </div>
          </div>
        </div>

        {/* Plugin Setup Section */}
        <div className="profile-section">
          <h2 className="section-title">🔌 Plugin Setup</h2>
          <p className="section-description">
            Download and install the Hideout Bot plugin for Roblox Studio to sync your projects
          </p>
          <div className="plugin-actions">
            <button className="btn btn-gradient" onClick={downloadPlugin}>
              📥 Download Plugin
            </button>
            <div className="plugin-instructions">
              <h3>Installation Instructions:</h3>
              <ol>
                <li>Download the plugin file</li>
                <li>Open Roblox Studio</li>
                <li>Go to Plugins → Manage Plugins</li>
                <li>Click "Install from File" and select the downloaded file</li>
                <li>Restart Roblox Studio</li>
                <li>Find "Hideout Bot" in your plugins toolbar</li>
              </ol>
            </div>
          </div>
        </div>

        {/* AWS Integration Section */}
        <div className="profile-section">
          <h2 className="section-title">☁️ AWS Integration</h2>
          <p className="section-description">
            Connect your AWS account to use Claude 4 or Claude 4.5 with your own billing
          </p>
          
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={saveAwsCredentials} className="aws-form">
            <div className="form-group">
              <label className="form-label">AWS Access Key ID</label>
              <input
                type="text"
                className="form-input"
                value={awsAccessKey}
                onChange={(e) => setAwsAccessKey(e.target.value)}
                placeholder="AKIAIOSFODNN7EXAMPLE"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">AWS Secret Access Key</label>
              <input
                type="password"
                className="form-input"
                value={awsSecretKey}
                onChange={(e) => setAwsSecretKey(e.target.value)}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">AWS Region</label>
              <select 
                className="form-input"
                value={awsRegion} 
                onChange={(e) => setAwsRegion(e.target.value)}
              >
                <option value="us-east-1">US East (N. Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">EU (Ireland)</option>
                <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
              </select>
            </div>
            
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save AWS Credentials'}
            </button>
            
            <div className="aws-info">
              <p>ℹ️ Your credentials are encrypted and stored securely.</p>
              <p>You maintain full control over your AWS billing and usage.</p>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="profile-section danger-zone">
          <h2 className="section-title">⚠️ Danger Zone</h2>
          <div className="danger-actions">
            <button className="btn btn-danger">
              Delete Account
            </button>
            <p>Once deleted, your account cannot be recovered.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px;
        }

        .profile-title {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 32px;
        }

        .profile-section {
          background: var(--surface);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          border: 1px solid var(--border);
        }

        .section-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .section-description {
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .stat-card {
          background: var(--surface-light);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .stat-label {
          color: var(--text-muted);
          font-size: 14px;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
        }

        .status-badge.connected {
          background: rgba(74, 222, 128, 0.2);
          color: #4ade80;
        }

        .status-badge.disconnected {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .plugin-actions {
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }

        .plugin-instructions {
          flex: 1;
          background: var(--surface-light);
          padding: 20px;
          border-radius: 12px;
        }

        .plugin-instructions h3 {
          font-size: 16px;
          margin-bottom: 12px;
          color: var(--primary);
        }

        .plugin-instructions ol {
          margin-left: 20px;
          line-height: 1.8;
          color: var(--text-muted);
        }

        .aws-form {
          max-width: 500px;
        }

        .aws-info {
          margin-top: 24px;
          padding: 16px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .aws-info p {
          margin: 8px 0;
          font-size: 14px;
          color: var(--text-muted);
        }

        .danger-zone {
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid rgba(239, 68, 68, 0.3);
        }

        .danger-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .danger-actions p {
          color: var(--text-muted);
          font-size: 14px;
        }

        .btn-danger {
          background: var(--danger);
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-danger:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .api-key-value {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }

        .api-key-value code {
          flex: 1;
          padding: 8px 12px;
          background: var(--background);
          border-radius: 6px;
          font-family: monospace;
          font-size: 14px;
          overflow-x: auto;
        }

        .copy-btn {
          padding: 6px 12px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .plugin-actions {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}
