import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('Completing Discord login...');

  useEffect(() => {
    const run = async () => {
      try {
        // Try to exchange the code for a session (PKCE flow)
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) {
          // If detectSessionInUrl already handled it, fall back to getSession
          const { data: sessionData } = await supabase.auth.getSession();
          if (!sessionData?.session) {
            setMessage(`Login failed: ${error.message}`);
            return;
          }
        }
        setMessage('Login successful! Redirecting...');
        // Small delay for UX, then go to dashboard
        setTimeout(() => navigate('/dashboard', { replace: true }), 500);
      } catch (err: any) {
        setMessage(`Login error: ${err?.message || 'Unknown error'}`);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh', color: 'white' }}>
      <div style={{ maxWidth: 420, textAlign: 'center' }}>
        <h2 style={{ marginBottom: 12 }}>Authorizing...</h2>
        <p style={{ opacity: 0.8 }}>{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
