const CACHE_NAME = 'eliteedu-pwa-v7';
const STATIC_ASSETS = [
  '/manifest.json',
  '/logo.png',
  '/favicon.ico',
  '/favicon.png',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-192.png',
  '/icons/icon-maskable-512.png'
];

const isLocalhost = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

self.addEventListener('install', (event) => {
  if (isLocalhost) {
    self.skipWaiting();
    return;
  }
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  if (isLocalhost) {
    event.waitUntil(self.clients.claim());
    return;
  }
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (isLocalhost || event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (url.pathname.startsWith('/api/public/verify-')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open('eliteedu-verify-cache').then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.open('eliteedu-verify-cache').then((cache) => cache.match(event.request)))
    );
    return;
  }

  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/auth') ||
    url.pathname.startsWith('/@') ||
    url.pathname.includes('node_modules') ||
    url.searchParams.has('t')
  ) {
    return;
  }

  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const toCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, toCache));
          }
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const contentType = response.headers.get('content-type') || '';
          if (url.pathname.includes('/assets/') && contentType.includes('text/html')) {
            return response;
          }
          const toCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, toCache));
          return response;
        })
        .catch(() => caches.match(event.request))
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/teacher/attendance?tab=leave';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          if ('navigate' in client) client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'EliteEdu Notification', message: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'EliteEdu Notification';
  const options = {
    body: data.message || data.body || '',
    icon: '/icons/icon-192.png',
    badge: '/favicon.png',
    data: { url: data.action_url || data.url || '/teacher/attendance?tab=leave' },
    vibrate: [200, 100, 200],
    tag: data.tag || 'eliteedu-notice'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
