import axios from 'axios';

const api = axios.create({
  baseURL: 'https://github.com/Bruno-A-Z/JAVA-CHALLENGE-FIAP-2026.git',
});

export default api;