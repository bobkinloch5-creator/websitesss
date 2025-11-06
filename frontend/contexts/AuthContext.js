import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/api';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Set client flag first
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user is logged in on mount and when localStorage changes
  useEffect(() => {
    if (!isClient) return;
    
    checkAuth();
    
    // Listen for storage changes (for multi-tab support)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isClient]);

  const handleStorageChange = (e) => {
    if (e.key === 'token') {
      if (e.newValue === null) {
        // Token was removed
        setUser(null);
        setIsAuthenticated(false);
        router.push('/login');
      } else {
        // Token was added/changed
        checkAuth();
      }
    }
  };

  const checkAuth = async () => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Verify token with backend
      const res = await auth.verify();
      
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        
        // Store user ID for other API calls
        if (res.data.user.id) {
          localStorage.setItem('userId', res.data.user.id);
        }
      } else {
        // Token is invalid
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // If verification fails, clear auth
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await auth.login(email, password);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (res.data.user?.id) {
          localStorage.setItem('userId', res.data.user.id);
        }
        setUser(res.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const loginWithDiscord = async (accessToken) => {
    try {
      const res = await auth.loginWithDiscord(accessToken);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (res.data.user?.id) {
          localStorage.setItem('userId', res.data.user.id);
        }
        setUser(res.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      console.error('Discord login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Discord login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  const refreshAuth = async () => {
    await checkAuth();
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    loginWithDiscord,
    logout,
    refreshAuth,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
