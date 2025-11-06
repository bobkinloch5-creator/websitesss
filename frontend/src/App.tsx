import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import PrivateRoute from './components/PrivateRoute';
import ProtectedLayout from './components/ProtectedLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Templates from './pages/Templates';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthCallback from './pages/AuthCallback';
import OfflineBanner from './components/OfflineBanner';
import Docs from './pages/Docs';
import Terms from './pages/Terms';
import Copyright from './pages/Copyright';
import OAuthCodeRedirect from './pages/OAuthCodeRedirect';
import { Toaster } from 'react-hot-toast';
import './App.css';
import './styles/navbar.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <WebSocketProvider>
            <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <OfflineBanner />
          <Routes>
            {/* Public routes - no navbar */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/copyright" element={<Copyright />} />
            {/* Root: forward any /?code=... to /auth/callback */}
            <Route path="/" element={<OAuthCodeRedirect />} />
            
            {/* Protected routes - with navbar and verification banner */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <ProtectedLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/templates" element={<Templates />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </ProtectedLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </WebSocketProvider>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
