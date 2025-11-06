import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://www.hideoutbot.lol/api';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://www.hideoutbot.lol';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const auth = {
  register: (email, password) => api.post('/auth/register', { email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  loginWithDiscord: (access_token) => api.post('/auth/discord', { access_token }),
  verify: () => api.get('/auth/verify'),
  verifyPlugin: (key) => api.get(`/auth/verify-plugin?key=${key}`),
  regenerateKey: () => api.post('/auth/regenerate-key'),
  me: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    return Promise.resolve();
  }
};

// Projects endpoints
export const projects = {
  list: () => api.get('/projects'),
  getAll: () => {
    const userId = localStorage.getItem('userId');
    return api.get(`/projects/${userId}`);
  },
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  save: (data) => api.post('/projects/save', data),
  export: (id) => api.get(`/projects/${id}/export`),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  getFiles: (id) => api.get(`/projects/${id}/files`)
};

// Prompts endpoints
export const prompts = {
  create: (data) => api.post('/prompts', data),
  submit: (data) => api.post('/prompts/submit', data),
  getByProject: (projectId) => api.get(`/prompts/project/${projectId}`),
  getStatus: (id) => api.get(`/prompts/status/${id}`),
  getHistory: () => api.get('/prompts/history'),
  updateStatus: (id, status) => api.put(`/prompts/${id}/status`, { status }),
};

// Plugin endpoints
export const plugin = {
  getActions: (apiKey) => api.get(`/plugin/actions/${apiKey}`),
  completeAction: (actionId, data) => api.post(`/plugin/complete/${actionId}`, data),
  sync: (projectId, data) => api.post(`/plugin/sync/${projectId}`, data),
  getChanges: (projectId) => api.get(`/plugin/changes/${projectId}`),
  download: () => `${API_URL}/plugin/download`
};

// Chat endpoints
export const chat = {
  getMessages: (projectId) => api.get(`/chat/${projectId}/messages`),
  sendMessage: (projectId, message) => api.post(`/chat/${projectId}/message`, { message }),
  selectPlan: (projectId, option) => api.post(`/chat/${projectId}/plan-select`, { option })
};

// User endpoints
export const users = {
  updateProfile: (data) => api.put('/users/profile', data),
  saveAwsCredentials: (data) => api.post('/users/aws-credentials', data),
  deleteAccount: () => api.delete('/users/account')
};

// WebSocket connection manager
class WebSocketManager {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = new WebSocket(`${WS_URL}?token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.emit('connected');
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.emit('disconnected');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit(data.type, data.payload);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(type, payload) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  joinProject(projectId) {
    this.send('join_project', { projectId });
  }

  leaveProject(projectId) {
    this.send('leave_project', { projectId });
  }
}

export const wsManager = new WebSocketManager();

export default api;
