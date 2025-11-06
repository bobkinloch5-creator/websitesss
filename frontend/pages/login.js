import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaDiscord } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { login, loginWithDiscord } = useAuth();

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle Discord OAuth callback
  useEffect(() => {
    if (!isClient) return;

    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (data?.session?.access_token) {
        // Discord login successful, send access token to our backend
        setLoading(true);
        const result = await loginWithDiscord(data.session.access_token);
        if (result.success) {
          await new Promise(resolve => setTimeout(resolve, 100));
          window.location.href = '/dashboard';
        } else {
          setError(result.error);
          setLoading(false);
        }
      }
    };

    handleAuthCallback();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token) {
        setLoading(true);
        const result = await loginWithDiscord(session.access_token);
        if (result.success) {
          await new Promise(resolve => setTimeout(resolve, 100));
          window.location.href = '/dashboard';
        } else {
          setError(result.error);
          setLoading(false);
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router, isClient]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      // Give a brief moment for localStorage to be set
      await new Promise(resolve => setTimeout(resolve, 100));
      // Use window.location for full page reload
      window.location.href = '/dashboard';
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleDiscordLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Use the Supabase callback URL
      const redirectUrl = 'https://www.hideoutbot.lol/login';
        
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: redirectUrl,
          scopes: 'identify email'
        }
      });
      
      if (error) {
        setError('Failed to initiate Discord login');
        setLoading(false);
      }
    } catch (err) {
      setError('Discord login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-bg relative z-10 px-4">
      <div className="form-container max-w-md w-full">
        <h1 className="text-3xl font-bold gradient-text mb-2 text-center">🏝️ Welcome Back</h1>
        <p className="text-center mb-8 opacity-80">Sign in to Hideout Bot</p>
        
        {error && (
          <div className="error-message">
            {typeof error === 'string' ? error : 'An error occurred'}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-gradient w-full mt-4" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="text-center mt-4">
            <Link href="/reset-password">
              <a className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                Forgot your password?
              </a>
            </Link>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-400 bg-gray-900">Or continue with</span>
            </div>
          </div>
          
          <button
            onClick={handleDiscordLogin}
            disabled={loading}
            className="discord-btn"
          >
            <FaDiscord className="discord-icon" />
            <span className="discord-text">Sign in with Discord</span>
            <div className="discord-glow"></div>
          </button>
        </div>
        
        <div className="text-center mt-6 opacity-80">
          Don't have an account?{' '}
          <Link href="/register">
            <a className="gradient-text font-semibold">Sign up</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
