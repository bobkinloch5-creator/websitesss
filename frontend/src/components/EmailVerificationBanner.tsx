import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes, FaEnvelope } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface EmailVerificationBannerProps {
  userEmail: string;
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({ userEmail }) => {
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  const handleResendVerification = async () => {
    setSending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      });

      if (error) throw error;

      toast.success('Verification email sent! Check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification email');
    } finally {
      setSending(false);
    }
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
          color: 'white',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <FaExclamationTriangle size={24} />
          <div>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '16px' }}>
              Email Not Verified
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.95 }}>
              Please verify your email address to access all features
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResendVerification}
            disabled={sending}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: 'white',
              fontWeight: '600',
              cursor: sending ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              opacity: sending ? 0.7 : 1,
            }}
          >
            <FaEnvelope />
            {sending ? 'Sending...' : 'Resend Email'}
          </motion.button>
          
          <button
            onClick={() => setDismissed(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
              opacity: 0.8,
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailVerificationBanner;
