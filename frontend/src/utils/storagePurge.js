const WHITELIST = new Set([
  'token',
  'user',
  'elite_active_campus_id',
  'elite_theme_settings',
  'theme',
  'pwa_installed'
]);

const STORAGE_VERSION_KEY = 'eliteedu_clean_version';
const CURRENT_STORAGE_VERSION = 'v8_2026';

export const runStorageCleanup = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;

    const current = localStorage.getItem(STORAGE_VERSION_KEY);
    if (current === CURRENT_STORAGE_VERSION) return false;

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !WHITELIST.has(key) && key !== STORAGE_VERSION_KEY) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });

    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);

    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name !== 'eliteedu-pwa-v8') {
            caches.delete(name).catch(() => {});
          }
        });
      }).catch(() => {});
    }

    return true;
  } catch {
    return false;
  }
};
