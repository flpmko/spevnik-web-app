import React, { createContext, useContext, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase-config';

const userContext = createContext();

export function UserContextProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState();

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => {
      unsub();
    };
  }, []);

  return (
    <userContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </userContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userContext);
}
