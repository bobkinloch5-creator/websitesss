import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ChangeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
}

const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({ isOpen, onClose, currentEmail }) => {
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newEmail === currentEmail) {
      toast.error('New email must be different from current email');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      
      if (error) throw error;

      toast.success('Verification email sent to new address!');
      onClose();
      setNewEmail('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to change email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <motion.div 
        className="modal-content"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '500px',
          width: '90%',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Change Email</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#666',
            }}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleChangeEmail}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Current Email
            </label>
            <input
              type="email"
              value={currentEmail}
              disabled
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: '#f5f5f5',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              New Email
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="your.new@email.com"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                background: '#9333ea',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Updating...' : 'Update Email'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ChangeEmailModal;
