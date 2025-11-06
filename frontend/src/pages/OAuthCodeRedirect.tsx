import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OAuthCodeRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasCode = params.has('code') || params.has('state');
    if (hasCode) {
      navigate(`/auth/callback${location.search}`, { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [location.search, navigate]);

  return null;
};

export default OAuthCodeRedirect;
