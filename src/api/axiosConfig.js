import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL?.trim();

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (!baseURL) {
    return Promise.reject(
      new Error(
        'Backend não configurado. Defina EXPO_PUBLIC_API_URL no arquivo .env com a URL pública da API.'
      )
    );
  }

  return config;
});

export default api;
