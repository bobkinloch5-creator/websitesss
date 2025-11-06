import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://www.hideoutbot.lol/update-password',
      });
      
      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for the password reset link!');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      setError('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-bg relative z-10 px-4">
      <div className="form-container max-w-md w-full">
        <h1 className="text-3xl font-bold gradient-text mb-2 text-center">🔑 Reset Password</h1>
        <p className="text-center mb-8 opacity-80">Enter your email to receive a password reset link</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {message && (
          <div className="success-message">
            {message}
          </div>
        )}
        
        <form onSubmit={handleResetPassword}>
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
          
          <button type="submit" className="btn btn-gradient w-full mt-4" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="text-center mt-6 opacity-80">
          Remember your password?{' '}
          <Link href="/login">
            <a className="gradient-text font-semibold">Sign in</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
