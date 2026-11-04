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

async function validateAdminAccess() {
  try {
    await api.get('/pet', { params: { page: 0, size: 1 } });
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('Este painel mobile requer um usuário com perfil ADMIN na API Clyvo.');
    }
    throw error;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const [token, username] = await Promise.all([getStoredToken(), getStoredUsername()]);
        if (token) {
          try {
            await validateAdminAccess();
            if (mounted) setUser({ username: username || 'Administrador', role: 'ADMIN' });
          } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
              await clearSession();
            } else if (mounted) {
              // Mantém a sessão durante indisponibilidade temporária da API.
              setUser({ username: username || 'Administrador', role: 'ADMIN' });
            }
          }
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
    if (!token) throw new Error('O backend não retornou o token de autenticação esperado.');

    await saveSession(token, username.trim());
    try {
      await validateAdminAccess();
    } catch (error) {
      await clearSession();
      throw error;
    }

    setUser({ username: username.trim(), role: 'ADMIN' });
    return response.data;
  };

  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  const value = useMemo(() => ({ user, isLoading, login, logout }), [user, isLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser utilizado dentro de AuthProvider.');
  return context;
}
