import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('Completing Discord login...');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    const run = async () => {
      try {
        // Try to exchange the code for a session (PKCE flow)
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) setDetails(error.message || 'Unknown exchange error');

        // Poll for a session for a few seconds in case exchange is delayed
        const started = Date.now();
        let sessionOk = false;
        while (Date.now() - started < 8000) {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session) {
            sessionOk = true;
            break;
          }
          await new Promise((r) => setTimeout(r, 500));
        }

        if (sessionOk) {
          setMessage('Login successful! Redirecting...');
          setTimeout(() => navigate('/dashboard', { replace: true }), 300);
          return;
        }

        // If still no session, send back to login with a hint
        setMessage('Login failed. Returning to login...');
        setTimeout(() => navigate('/login', { replace: true }), 1200);
      } catch (err: any) {
        setDetails(err?.message || 'Unknown error');
        setMessage('Login error. Returning to login...');
        setTimeout(() => navigate('/login', { replace: true }), 1200);
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
        {details && (
          <p style={{ opacity: 0.6, fontSize: 12, marginTop: 8 }}>{details}</p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
