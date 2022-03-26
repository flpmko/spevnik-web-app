import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserContext';

const PrivateRoute = ({ children }) => {
  let { getUser } = useUserAuth();
  const currentUser = getUser();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
