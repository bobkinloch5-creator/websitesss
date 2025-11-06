import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: var(--background);
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid var(--surface);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: var(--text);
  font-size: 1rem;
`;

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('🔐 PrivateRoute - Loading:', loading, 'User:', user?.id);

  // Show loading while checking auth
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading your workspace...</LoadingText>
      </LoadingContainer>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    console.log('❌ No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated - render children
  console.log('✅ User authenticated, rendering protected route');
  return <>{children}</>;
};

export default PrivateRoute;
