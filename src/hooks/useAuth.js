import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axiosConfig';
import {
  clearSession,
  getStoredToken,
  getStoredUsername,
  saveSession,
  setUnauthorizedHandler,
} from '../services/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const [token, username] = await Promise.all([
          getStoredToken(),
          getStoredUsername(),
        ]);

        if (mounted && token) {
          setUser({ username: username || 'Administrador' });
        }
      } catch (error) {
        console.warn('Não foi possível restaurar a sessão:', error);
        await clearSession();
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    setUnauthorizedHandler(() => {
      if (mounted) setUser(null);
    });

    restoreSession();

    return () => {
      mounted = false;
      setUnauthorizedHandler(null);
    };
  }, []);

  const login = async (username, password) => {
    const response = await api.post('/auth/login', {
      username: username.trim(),
      password,
    });

    const token = response.data?.token;
    if (!token) {
      throw new Error('O backend não retornou o token de autenticação esperado.');
    }

    await saveSession(token, username.trim());
    setUser({ username: username.trim() });
    return response.data;
  };

  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
  }
  return context;
}
