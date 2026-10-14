import { useState, useEffect, useCallback } from 'react';

export const usePwaInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  const checkIsInstalled = useCallback(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');
    const storedInstalled = localStorage.getItem('pwa_installed') === 'true';
    return isStandalone || storedInstalled;
  }, []);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) && !window.MSStream;
    setIsIos(isIosDevice);

    const alreadyInstalled = checkIsInstalled();
    if (alreadyInstalled) {
      setIsInstalled(true);
      setShowPrompt(false);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!checkIsInstalled()) {
        setShowPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwa_installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const fallbackTimer = setTimeout(() => {
      if (!checkIsInstalled()) {
        setShowPrompt(true);
      }
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(fallbackTimer);
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
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          localStorage.setItem('pwa_installed', 'true');
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
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
    isInstalled,
    showPrompt,
    setShowPrompt,
    promptInstall,
    closePrompt,
    isIos,
    showIosGuide,
    setShowIosGuide,
    hasNativePrompt: Boolean(deferredPrompt)
  };
};
