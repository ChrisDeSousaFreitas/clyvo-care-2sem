import axios from 'axios';
import { getStoredToken, handleUnauthorized } from '../services/authStorage';

const baseURL = (
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  'https://java-challenge-fiap-2026.onrender.com'
).replace(/\/$/, '');

const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    Accept: 'application/hal+json, application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getStoredToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      try {
        await handleUnauthorized();
      } catch (storageError) {
        console.warn('Não foi possível limpar a sessão expirada:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error, fallback = 'Não foi possível concluir a operação.') {
  const data = error?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.detail) return data.detail;
  if (error?.code === 'ECONNABORTED') return 'A API demorou para responder. Tente novamente.';
  if (!error?.response) return 'Não foi possível conectar ao backend. Confira a internet e a URL da API.';
  if (error.response.status === 401) return 'Credenciais inválidas ou sessão expirada. Entre novamente.';
  if (error.response.status === 403) return 'Seu usuário não tem permissão para esta operação no backend.';
  if (error.response.status === 404) return 'O recurso solicitado não foi encontrado na API.';
  if (error.response.status === 400) return 'Os dados enviados não correspondem às validações do backend.';
  return fallback;
}

export function extractCollection(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;

  const embedded = payload?._embedded;
  if (embedded && typeof embedded === 'object') {
    return Object.values(embedded).filter(Array.isArray).flat();
  }

  return [];
}

export default api;
