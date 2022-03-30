import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useUserAuth();
  const userKey = Object.keys(window.sessionStorage).filter((item) =>
    item.startsWith('firebase:authUser')
  )[0];
  const sessionUser = userKey
    ? JSON.parse(sessionStorage.getItem(userKey))
    : undefined;

  if (!currentUser && !sessionUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
