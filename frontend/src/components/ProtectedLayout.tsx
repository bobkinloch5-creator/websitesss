import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import EmailVerificationBanner from './EmailVerificationBanner';
import Navbar from './Navbar';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const { user, session } = useAuth();
  
  // Check if email is not verified
  const emailNotVerified = session?.user && !session.user.email_confirmed_at;

  return (
    <>
      <Navbar />
      {emailNotVerified && user?.email && (
        <EmailVerificationBanner userEmail={user.email} />
      )}
      {children}
    </>
  );
};

export default ProtectedLayout;
