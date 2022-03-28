import React, { createContext, useContext, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth';
import { auth } from '../firebase-config';

const userContext = createContext();

export function UserContextProvider({ children }) {
  const [currentUser, setCurrentUser] = React.useState();

  const login = async (email, password) => {
    await setPersistence(auth, browserSessionPersistence).then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    });
  };

  const logout = () => {
    return signOut(auth);
  };

  const getUser = () => {
    return auth.currentUser;
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => {
      unsub();
    };
  }, []);

  return (
    <userContext.Provider value={{ currentUser, login, logout, getUser }}>
      {children}
    </userContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userContext);
}
