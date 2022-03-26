import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserContext';

function PrivateRoute({ children }) {
  let { currentUser } = useUserAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
