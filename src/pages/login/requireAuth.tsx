// RequireAuth.js
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

export function RequireAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { route } = useAuthenticator((context) => [context.route]);

  useEffect(() => {
    setLoading(true);
    const authenticationCheckDelay = setTimeout(() => {
      setLoading(false);
    }, 1000); 
    return () => clearTimeout(authenticationCheckDelay);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (route !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function Loader() {
  // Replace this with your loader component or loading state
  return <div>Loading...</div>;
}
