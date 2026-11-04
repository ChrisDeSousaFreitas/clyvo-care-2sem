import { useState, useEffect } from 'react';
import { auth } from '../services/firebaseConfig';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);

  const register = async (email, password, displayName) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );

    if (displayName?.trim()) {
      await updateProfile(credential.user, { displayName: displayName.trim() });
    }

    return credential;
  };

  const logout = () => signOut(auth);

  return { user, isLoading, login, register, logout };
};
