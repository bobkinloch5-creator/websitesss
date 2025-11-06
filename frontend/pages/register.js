import { useState, useEffect } from 'react';
import { auth } from '../lib/api';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Register with our backend first
      const res = await auth.register(email, password);
      
      if (res.data.success && res.data.token) {
        // Store the token and user ID
        localStorage.setItem('token', res.data.token);
        if (res.data.user?.id) {
          localStorage.setItem('userId', res.data.user.id);
        }
        
        // Give a brief moment for localStorage to be set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Navigate to dashboard
        window.location.href = '/dashboard';
      } else {
        setError('Registration failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-bg relative z-10 px-4">
      <div className="form-container max-w-md w-full">
        <h1 className="text-3xl font-bold gradient-text mb-2 text-center">🚀 Join Hideout Bot</h1>
        <p className="text-center mb-8 opacity-80">Create your account</p>
        
        {error && (
          <div className="error-message">
            {typeof error === 'string' ? error : 'An error occurred'}
          </div>
        )}
        
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="coolbuilder123"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

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
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-gradient w-full mt-4" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="text-center mt-6 opacity-80">
          Already have an account?{' '}
          <Link href="/login">
            <a className="gradient-text font-semibold">Sign in</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
