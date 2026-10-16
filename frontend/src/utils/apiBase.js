export const getApiBase = () => {
  const raw = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  return raw.endsWith('/api') || raw.endsWith('/api/') ? raw.replace(/\/+$/, '') : `${raw.replace(/\/+$/, '')}/api`;
};
