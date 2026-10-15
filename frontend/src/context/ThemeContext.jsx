import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { DEFAULT_THEME, getActiveColorMeta } from '../utils/themeConstants';
import ThemeTransition from '../components/common/ThemeTransition';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('elite_theme_settings');
      return cached ? { ...DEFAULT_THEME, ...JSON.parse(cached) } : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const [transitionState, setTransitionState] = useState({ isAnimating: false, isClosed: false });
  const debounceRef = useRef(null);

  const applyThemeToDom = useCallback((t) => {
    document.documentElement.classList.toggle('dark', t.mode === 'dark');
    document.documentElement.setAttribute('data-bs-theme', t.mode);
    document.documentElement.setAttribute('dir', t.placement || 'ltr');
    document.documentElement.setAttribute('data-sidebar-bg', t.sidebarBg || 'light');
    document.documentElement.setAttribute('data-header-bg', t.headerBg || 'white');

    const meta = getActiveColorMeta(t.activeColor);
    const root = document.documentElement.style;
    root.setProperty('--color-primary', meta.hex);
    root.setProperty('--color-primary-hover', meta.hover);
    root.setProperty('--color-primary-soft', meta.soft);
  }, []);

  useEffect(() => {
    applyThemeToDom(settings);
  }, [settings, applyThemeToDom]);

  useEffect(() => {
    if (user?.theme_settings) {
      setSettings((prev) => {
        const next = { ...prev, ...user.theme_settings };
        localStorage.setItem('elite_theme_settings', JSON.stringify(next));
        return next;
      });
    }
  }, [user]);

  const triggerAnimation = useCallback((onMidpoint) => {
    if (transitionState.isAnimating) return onMidpoint && onMidpoint();
    setTransitionState({ isAnimating: true, isClosed: false });
    requestAnimationFrame(() => setTransitionState({ isAnimating: true, isClosed: true }));
    setTimeout(() => onMidpoint && onMidpoint(), 280);
    setTimeout(() => setTransitionState({ isAnimating: true, isClosed: false }), 620);
    setTimeout(() => setTransitionState({ isAnimating: false, isClosed: false }), 920);
  }, [transitionState.isAnimating]);

  const syncToBackend = useCallback((next) => {
    if (user?.role !== 'Admin') return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await api.patch('/schools/theme', next);
      } catch (err) {
        console.error('Failed to sync theme:', err);
      }
    }, 400);
  }, [user?.role]);

  const updateThemeSetting = useCallback((key, value) => {
    triggerAnimation(() => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        localStorage.setItem('elite_theme_settings', JSON.stringify(next));
        if (key === 'mode') localStorage.setItem('theme', value);
        syncToBackend(next);
        return next;
      });
    });
  }, [triggerAnimation, syncToBackend]);

  const resetThemeToDefault = useCallback(() => {
    triggerAnimation(() => {
      setSettings(DEFAULT_THEME);
      localStorage.setItem('elite_theme_settings', JSON.stringify(DEFAULT_THEME));
      localStorage.setItem('theme', DEFAULT_THEME.mode);
      syncToBackend(DEFAULT_THEME);
    });
  }, [triggerAnimation, syncToBackend]);

  return (
    <ThemeContext.Provider
      value={{
        themeSettings: settings,
        updateThemeSetting,
        resetThemeToDefault,
        transitionState,
        triggerAnimation
      }}
    >
      {children}
      <ThemeTransition isAnimating={transitionState.isAnimating} isClosed={transitionState.isClosed} />
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
