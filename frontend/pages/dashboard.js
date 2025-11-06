import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ProjectList from '../components/ProjectList';
import PromptInput from '../components/PromptInput';
import ActionViewer from '../components/ActionViewer';
import { projects as projectsApi, prompts } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [promptBalance, setPromptBalance] = useState(100);
  const [fileStructure, setFileStructure] = useState([]);
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
    if (isAuthenticated) {
      fetchProjects();
      fetchUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedProject) {
      fetchMessages(selectedProject._id);
      fetchFileStructure(selectedProject._id);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const res = await projectsApi.list();
      setProjects(res.data);
      if (res.data.length > 0 && !selectedProject) {
        setSelectedProject(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchUserData = async () => {
    try {
      // Use the user data from AuthContext
      if (user) {
        setPromptBalance(user.promptsRemaining || 100);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const fetchMessages = async (projectId) => {
    try {
      const res = await prompts.getByProject(projectId);
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const fetchFileStructure = async (projectId) => {
    // Mock file structure for now
    setFileStructure([
      { name: 'Workspace', type: 'folder', children: [
        { name: 'MainScript', type: 'script' },
        { name: 'GameLogic', type: 'script' }
      ]},
      { name: 'ReplicatedStorage', type: 'folder', children: [
        { name: 'Modules', type: 'folder' }
      ]},
      { name: 'ServerScriptService', type: 'folder', children: [] }
    ]);
  };

  const createProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await projectsApi.create({
        name: newProjectName,
        description: newProjectDescription
      });
      setProjects([...projects, res.data]);
      setSelectedProject(res.data);
      setShowNewProjectModal(false);
      setNewProjectName('');
      setNewProjectDescription('');
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSubmit = async (prompt) => {
    if (!selectedProject) return;
    
    setLoading(true);
    const userMessage = {
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };
    setMessages([...messages, userMessage]);
    
    try {
      const res = await prompts.create({
        projectId: selectedProject._id,
        content: prompt
      });
      
      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: res.data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Update actions
      if (res.data.actions) {
        setActions(prev => [...prev, ...res.data.actions]);
      }
      
      // Update prompt balance
      setPromptBalance(prev => Math.max(0, prev - 1));
      
    } catch (err) {
      console.error('Error sending prompt:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderFileTree = (files, depth = 0) => {
    return files.map((file, index) => (
      <div key={index} style={{ paddingLeft: depth * 20 }}>
        <div className="file-item">
          {file.type === 'folder' ? '📁' : '📄'} {file.name}
        </div>
        {file.children && renderFileTree(file.children, depth + 1)}
      </div>
    ));
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">📁 Your Projects</h1>
          <div className="flex gap-4 items-center">
            <div className="prompt-balance">
              ⚡ {promptBalance} prompts
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowNewProjectModal(true)}
            >
              + New Project
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="project-sidebar">
            <ProjectList 
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
            />
          </div>

          <div className="chat-section">
            {selectedProject ? (
              <>
                <div className="chat-header">
                  <h2>{selectedProject.name}</h2>
                  <span className={`sync-badge ${selectedProject.synced ? 'synced' : ''}`}>
                    {selectedProject.synced ? '✓ Synced' : '○ Not Synced'}
                  </span>
                </div>

                <div className="messages-container">
                  {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                      <div className="message-avatar">
                        {message.role === 'user' ? '👤' : '🤖'}
                      </div>
                      <div className="message-content">
                        {message.content}
                        {message.planMode && (
                          <div className="plan-options">
                            <h4>Choose Your Approach:</h4>
                            {message.planMode.options.map((option, i) => (
                              <div key={i} className="plan-option">
                                <strong>{option.label}</strong>
                                <p>{option.description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="message assistant">
                      <div className="message-avatar">🤖</div>
                      <div className="message-content">
                        <div className="loading-spinner"></div>
                        Thinking...
                      </div>
                    </div>
                  )}
                </div>

                <PromptInput 
                  onSubmit={handlePromptSubmit}
                  disabled={loading}
                />

                <ActionViewer actions={actions} />
              </>
            ) : (
              <div className="no-project">
                <p>Select a project or create a new one to get started</p>
              </div>
            )}
          </div>

          {selectedProject && (
            <div className="file-structure-sidebar">
              <h3 className="section-title">📁 File Structure</h3>
              <div className="file-tree">
                {renderFileTree(fileStructure)}
              </div>
            </div>
          )}
        </div>

        {/* New Project Modal */}
        {showNewProjectModal && (
          <div className="modal-overlay" onClick={() => setShowNewProjectModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Create New Project</h2>
              <form onSubmit={createProject}>
                <div className="form-group">
                  <label className="form-label">Project Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="My Awesome Game"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    placeholder="A brief description of your game..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Project'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setShowNewProjectModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: 300px 1fr 300px;
          gap: 24px;
          margin-top: 24px;
        }

        .chat-section {
          background: var(--surface);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 200px);
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 16px;
        }

        .sync-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          background: rgba(255, 255, 255, 0.1);
        }

        .sync-badge.synced {
          background: rgba(74, 222, 128, 0.2);
          color: #4ade80;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
        }

        .message {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .message.assistant .message-avatar {
          background: var(--secondary);
        }

        .message-content {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 12px;
          background: var(--surface-light);
        }

        .message.user .message-content {
          background: var(--primary);
        }

        .plan-options {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }

        .plan-option {
          background: var(--background);
          padding: 12px;
          border-radius: 8px;
          margin-top: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .plan-option:hover {
          background: var(--surface);
          transform: translateX(4px);
        }

        .file-structure-sidebar {
          background: var(--surface);
          border-radius: 16px;
          padding: 24px;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }

        .file-tree {
          margin-top: 16px;
        }

        .file-item {
          padding: 8px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .file-item:hover {
          background: var(--surface-light);
        }

        .project-sidebar {
          background: var(--surface);
          border-radius: 16px;
          padding: 24px;
        }

        .prompt-balance {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: var(--surface);
          padding: 32px;
          border-radius: 16px;
          max-width: 500px;
          width: 90%;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .no-project {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
        }

        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .file-structure-sidebar {
            display: none;
          }
        }
      `}</style>
    </Layout>
  );
}
