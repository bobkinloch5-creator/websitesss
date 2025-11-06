import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setSent(true);
        toast.success('Password reset email sent! Check your inbox.');
      }
    } catch (err: any) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
          <p className="text-gray-600">
            {sent 
              ? "Check your email for a reset link" 
              : "Enter your email to reset your password"
            }
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleResetPassword}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>Reset email sent! Check your inbox and spam folder.</span>
            </div>
            <button
              onClick={() => setSent(false)}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Resend Email
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link
            to="/login"
            className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
