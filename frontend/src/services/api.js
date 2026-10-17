import axios from 'axios';
import { reportNetworkError, getLastClickedElement } from '../utils/telemetryAgent';
import { emitToastError } from '../utils/toastEvents';

const rawUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const baseURL = rawUrl.endsWith('/api') || rawUrl.endsWith('/api/') ? rawUrl : `${rawUrl.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const lastAction = getLastClickedElement();
  if (lastAction) {
    config.headers['x-client-action'] = lastAction;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      reportNetworkError(error);
    } catch {}
    const method = error.config?.method?.toLowerCase();
    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      const msg = error.response?.data?.message || error.message || 'Operation failed';
      emitToastError(msg, 'Request Failed');
    }
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
