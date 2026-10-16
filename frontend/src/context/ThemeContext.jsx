import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { DEFAULT_THEME, getActiveColorMeta, HEADER_BG_PRESETS } from '../utils/themeConstants';
import ThemeTransition from '../components/common/ThemeTransition';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(() => {
    try {
      const c = localStorage.getItem('elite_theme_settings');
      return c ? { ...DEFAULT_THEME, ...JSON.parse(c) } : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const [transitionState, setTransitionState] = useState({ isAnimating: false, isClosed: false });
  const debounceRef = useRef(null);

  const applyThemeToDom = useCallback((t) => {
    const d = document.documentElement;
    d.classList.toggle('dark', t.mode === 'dark');
    d.setAttribute('data-bs-theme', t.mode);
    d.setAttribute('dir', t.placement || 'ltr');
    d.setAttribute('data-header-bg', t.headerBg || 'white');
    d.setAttribute('data-sidebar-bg', t.headerBg || 'white');
    const meta = getActiveColorMeta(t.activeColor);
    d.style.setProperty('--color-primary', meta.hex);
    d.style.setProperty('--color-primary-hover', meta.hover);
    d.style.setProperty('--color-primary-soft', meta.soft);
  }, []);

  useEffect(() => { applyThemeToDom(settings); }, [settings, applyThemeToDom]);

  useEffect(() => {
    if (user?.theme_settings) {
      setSettings((prev) => {
        const next = { ...prev, ...user.theme_settings };
        localStorage.setItem('elite_theme_settings', JSON.stringify(next));
        return next;
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user?.school_id) return;
    api.get('/schools/theme').then((res) => {
      if (res.data?.theme_settings) {
        setSettings((prev) => {
          const next = { ...prev, ...res.data.theme_settings };
          localStorage.setItem('elite_theme_settings', JSON.stringify(next));
          return next;
        });
      }
    }).catch(() => {});
  }, [user?.school_id]);

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
        if (key === 'headerBg') {
          next.sidebarBg = value;
          const match = HEADER_BG_PRESETS.find((p) => p.id === value);
          if (match?.activeColor) next.activeColor = match.activeColor;
        }
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
    <ThemeContext.Provider value={{ themeSettings: settings, updateThemeSetting, resetThemeToDefault, transitionState, triggerAnimation }}>
      {children}
      <ThemeTransition isAnimating={transitionState.isAnimating} isClosed={transitionState.isClosed} />
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext) || DEFAULT_THEME;
