import axios from 'axios';
import { reportNetworkError, getLastClickedElement } from '../utils/telemetryAgent';
import { emitToastError } from '../utils/toastEvents';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') || envUrl.endsWith('/api/') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api`;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000
});

api.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('/api')) {
    config.url = config.url.replace(/^\/api(\/|$)/, '/');
  }
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const activeCampus = localStorage.getItem('elite_active_campus_id');
  if (activeCampus && activeCampus !== 'all') {
    config.headers['x-campus-id'] = activeCampus;
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
