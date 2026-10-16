import { useState, useEffect, useCallback } from 'react';

let globalDeferredPrompt = null;
let globalIsInstalled = false;
const subscribers = new Set();

const notifySubscribers = () => {
  subscribers.forEach((cb) => cb());
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    globalDeferredPrompt = e;
    globalIsInstalled = false;
    try {
      localStorage.removeItem('pwa_installed');
    } catch {}
    notifySubscribers();
  });

  window.addEventListener('appinstalled', () => {
    globalIsInstalled = true;
    globalDeferredPrompt = null;
    notifySubscribers();
  });
}

export const usePwaInstall = () => {
  const checkIsStandalone = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  }, []);

  const [isStandalone, setIsStandalone] = useState(checkIsStandalone);
  const [hasPrompt, setHasPrompt] = useState(Boolean(globalDeferredPrompt));
  const [showPrompt, setShowPrompt] = useState(Boolean(globalDeferredPrompt));
  const [showGuide, setShowGuide] = useState(false);
  const [guidePlatform, setGuidePlatform] = useState('desktop');

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua) && !window.MSStream) {
      setGuidePlatform('ios');
    } else if (/android/.test(ua)) {
      setGuidePlatform('android');
    } else {
      setGuidePlatform('desktop');
    }

    if (typeof navigator !== 'undefined' && 'getInstalledRelatedApps' in navigator) {
      navigator.getInstalledRelatedApps().then((apps) => {
        if (Array.isArray(apps) && apps.length === 0) {
          globalIsInstalled = false;
          try { localStorage.removeItem('pwa_installed'); } catch {}
          notifySubscribers();
        }
      }).catch(() => {});
    }

    const updateState = () => {
      const standalone = checkIsStandalone();
      setIsStandalone(standalone);
      setHasPrompt(Boolean(globalDeferredPrompt));
      if (!standalone && globalDeferredPrompt) {
        setShowPrompt(true);
      }
    };

    updateState();
    subscribers.add(updateState);
    return () => {
      subscribers.delete(updateState);
    };
  }, [checkIsStandalone]);

  const promptInstall = async () => {
    if (globalDeferredPrompt) {
      try {
        await globalDeferredPrompt.prompt();
        const choice = await globalDeferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          globalIsInstalled = true;
          setShowPrompt(false);
        }
        globalDeferredPrompt = null;
        setHasPrompt(false);
        notifySubscribers();
      } catch {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return {
    isInstalled: isStandalone,
    hasNativePrompt: hasPrompt,
    showPrompt,
    setShowPrompt,
    showGuide,
    setShowGuide,
    guidePlatform,
    promptInstall,
    closePrompt: () => setShowPrompt(false),
    closeGuide: () => setShowGuide(false)
  };
};

export default usePwaInstall;
