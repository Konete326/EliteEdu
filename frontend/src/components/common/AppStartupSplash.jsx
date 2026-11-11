import { useState, useEffect, useCallback, memo } from 'react';
import MeltMark from '../ui/melt-mark';
import { useTheme } from '../../context/ThemeContext';

const AppStartupSplash = () => {
  const [mounted, setMounted] = useState(() => {
    try {
      return sessionStorage.getItem('elite_splash_shown') !== 'true';
    } catch {
      return true;
    }
  });
  const [fading, setFading] = useState(false);
  const { themeSettings } = useTheme();

  const isDark = themeSettings?.mode === 'dark' || (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark');
  const bg = isDark ? '#09090b' : '#ffffff';
  const fg = isDark ? '#ffffff' : '#09090b';

  const handleFinish = useCallback(() => {
    setFading(true);
    try {
      sessionStorage.setItem('elite_splash_shown', 'true');
    } catch {}
    const timer = setTimeout(() => {
      setMounted(false);
      try {
        const el = document.getElementById('pwa-splash');
        if (el) el.remove();
      } catch {}
    }, 320);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) {
      try {
        const el = document.getElementById('pwa-splash');
        if (el) el.remove();
      } catch {}
      return;
    }
    const fallback = setTimeout(() => {
      handleFinish();
    }, 1450);
    return () => clearTimeout(fallback);
  }, [mounted, handleFinish]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center transition-opacity duration-300 pointer-events-none select-none ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: bg }}
    >
      <div className="w-full h-full max-w-md max-h-96 flex items-center justify-center p-6">
        <MeltMark
          text="eliteedu"
          color={fg}
          background={bg}
          size={0.22}
          speed={3.2}
          loop={false}
          interactive={false}
          onComplete={handleFinish}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default memo(AppStartupSplash);

