export const requestPwaNotificationPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
};

export const showPwaNotification = async (title, options = {}) => {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const defaultOptions = {
    icon: '/icons/icon-192.png',
    badge: '/favicon.png',
    vibrate: [200, 100, 200],
    renotify: true,
    tag: options.tag || `eliteedu-notif-${Date.now()}`,
    ...options
  };

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title || 'EliteEdu Notification', defaultOptions);
        return;
      }
    }
  } catch {}

  try {
    new Notification(title || 'EliteEdu Notification', defaultOptions);
  } catch {}
};
