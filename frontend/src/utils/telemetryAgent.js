let lastClickedElement = 'Page Load / None';
const recentLogs = new Map();

const getApiBase = () => {
  const raw = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  return raw.endsWith('/api') || raw.endsWith('/api/') ? raw.replace(/\/+$/, '') : `${raw.replace(/\/+$/, '')}/api`;
};

export const getLastClickedElement = () => lastClickedElement;

export const reportTelemetry = async (payload) => {
  const msg = String(payload.message || '').trim();
  if (!msg || msg.includes('/logs') || payload.endpoint?.includes('/logs')) return;

  const dedupeKey = `${payload.category}_${msg.slice(0, 80)}`;
  const now = Date.now();
  if (recentLogs.has(dedupeKey) && now - recentLogs.get(dedupeKey) < 3000) return;
  recentLogs.set(dedupeKey, now);

  try {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    await fetch(`${getApiBase()}/logs/telemetry`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...payload,
        page_url: payload.page_url || window.location.href,
        last_clicked_element: payload.last_clicked_element || lastClickedElement
      })
    });
  } catch {}
};

export const reportNetworkError = (error) => {
  const url = error.config?.url || '';
  if (url.includes('/logs')) return;
  const status = error.response?.status || null;
  const backendMsg = error.response?.data?.message;
  reportTelemetry({
    category: 'NETWORK_ERROR',
    severity: status && status >= 500 ? 'CRITICAL' : 'ERROR',
    message: backendMsg || error.message || `HTTP ${status || 'Network Error'} on ${url}`,
    endpoint: url,
    method: error.config?.method ? error.config.method.toUpperCase() : 'GET',
    status_code: status,
    page_url: window.location.href,
    last_clicked_element: lastClickedElement,
    stack_trace: error.stack || ''
  });
};

export const initTelemetry = () => {
  if (typeof window === 'undefined' || window.__TELEMETRY_INITIALIZED__) return;
  window.__TELEMETRY_INITIALIZED__ = true;

  document.addEventListener('click', (e) => {
    const el = e.target?.closest?.('button, a, input[type="submit"], input[type="button"], [role="button"]');
    if (el) {
      const tag = el.tagName.toLowerCase();
      const type = tag === 'a' ? 'Link' : 'Button';
      const label = (el.innerText || el.value || el.getAttribute('aria-label') || el.title || '').trim().replace(/\s+/g, ' ').slice(0, 35);
      lastClickedElement = `${type}: "${label || 'Action'}" (${window.location.pathname})`;
    }
  }, true);

  window.addEventListener('error', (event) => {
    reportTelemetry({
      category: 'RUNTIME_ERROR',
      severity: 'ERROR',
      message: event.message || 'Script error',
      page_url: window.location.href,
      last_clicked_element: lastClickedElement,
      stack_trace: event.error?.stack || ''
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = typeof reason === 'string' ? reason : (reason?.message || 'Unhandled Rejection');
    reportTelemetry({
      category: 'RUNTIME_ERROR',
      severity: 'ERROR',
      message: msg,
      page_url: window.location.href,
      last_clicked_element: lastClickedElement,
      stack_trace: reason?.stack || ''
    });
  });

  const originalError = console.error;
  console.error = (...args) => {
    originalError.apply(console, args);
    try {
      const first = args[0];
      const msg = typeof first === 'string' ? first : (first?.message || JSON.stringify(first));
      if (msg && !msg.includes('/logs') && !msg.includes('telemetry') && !msg.includes('Agentation')) {
        reportTelemetry({
          category: 'CONSOLE_ERROR',
          severity: 'ERROR',
          message: msg.slice(0, 300),
          page_url: window.location.href,
          last_clicked_element: lastClickedElement,
          stack_trace: args[1]?.stack || (first instanceof Error ? first.stack : '')
        });
      }
    } catch {}
  };
};
