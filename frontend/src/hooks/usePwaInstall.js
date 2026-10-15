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
    notifySubscribers();
  });

  window.addEventListener('appinstalled', () => {
    globalIsInstalled = true;
    globalDeferredPrompt = null;
    try {
      localStorage.setItem('pwa_installed', 'true');
    } catch {}
    notifySubscribers();
  });
}

export const usePwaInstall = () => {
  const checkIsInstalled = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');
    const storedInstalled = localStorage.getItem('pwa_installed') === 'true';
    return isStandalone || storedInstalled || globalIsInstalled;
  }, []);

  const [installed, setInstalled] = useState(checkIsInstalled);
  const [hasPrompt, setHasPrompt] = useState(Boolean(globalDeferredPrompt));
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) && !window.MSStream;
    setIsIos(isIosDevice);

    const updateState = () => {
      const isInst = checkIsInstalled();
      setInstalled(isInst);
      setHasPrompt(Boolean(globalDeferredPrompt));
      if (!isInst && globalDeferredPrompt) {
        setShowPrompt(true);
      }
    };

    updateState();
    subscribers.add(updateState);
    return () => {
      subscribers.delete(updateState);
    };
  }, [checkIsInstalled]);

  useEffect(() => {
    if (!showPrompt) return;
    const autoCloseTimer = setTimeout(() => {
      setShowPrompt(false);
    }, 10000);
    return () => clearTimeout(autoCloseTimer);
  }, [showPrompt]);

  const promptInstall = async () => {
    if (globalDeferredPrompt) {
      try {
        await globalDeferredPrompt.prompt();
        const choice = await globalDeferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          globalIsInstalled = true;
          setInstalled(true);
          try {
            localStorage.setItem('pwa_installed', 'true');
          } catch {}
          setShowPrompt(false);
        }
        globalDeferredPrompt = null;
        setHasPrompt(false);
        notifySubscribers();
      } catch (err) {
        console.error(err);
      }
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  const closePrompt = () => {
    setShowPrompt(false);
  };

  return {
    isInstalled: installed,
    showPrompt,
    setShowPrompt,
    promptInstall,
    closePrompt,
    isIos,
    showIosGuide,
    setShowIosGuide,
    hasNativePrompt: hasPrompt
  };
};
