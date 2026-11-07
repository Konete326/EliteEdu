import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { DEFAULT_THEME, getActiveColorMeta } from '../utils/themeConstants';
import ThemeTransition from '../components/common/ThemeTransition';

const ThemeContext = createContext(null);

const sanitizeTheme = (raw) => {
  const merged = { ...DEFAULT_THEME, ...(raw || {}) };
  if (merged.mode !== 'dark') {
    merged.mode = 'light';
  }
  if (!merged.headerBg) {
    merged.headerBg = 'white';
  }
  if (!merged.sidebarBg) {
    merged.sidebarBg = merged.headerBg || 'white';
  }
  if (merged.activeColor === '#4f46e5') {
    merged.activeColor = DEFAULT_THEME.activeColor;
  }
  return merged;
};

export const ThemeProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState(() => {
    try {
      const c = localStorage.getItem('elite_theme_settings');
      return c ? sanitizeTheme(JSON.parse(c)) : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const debounceRef = useRef(null);

  const applyThemeToDom = useCallback((t) => {
    const d = document.documentElement;
    const isDark = t.mode === 'dark';
    d.classList.toggle('dark', isDark);
    d.setAttribute('data-bs-theme', t.mode || 'light');
    d.setAttribute('dir', t.placement || 'ltr');
    d.setAttribute('data-header-bg', t.headerBg || 'white');
    d.setAttribute('data-sidebar-bg', t.sidebarBg || t.headerBg || 'white');
    const meta = getActiveColorMeta(t.activeColor);
    d.style.setProperty('--color-primary', meta.hex);
    d.style.setProperty('--color-primary-hover', meta.hover);
    d.style.setProperty('--color-primary-soft', meta.soft);

    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('bg-[#09090b]', 'text-[#fafafa]');
      document.body.classList.toggle('dark', isDark);
    }
  }, []);

  useEffect(() => {
    applyThemeToDom(settings);
  }, [settings, applyThemeToDom]);

  useEffect(() => {
    const hasUserSelected = localStorage.getItem('elite_theme_user_selected') === 'true';
    if (hasUserSelected) return;

    if (user?.theme_settings) {
      setSettings((prev) => {
        const next = sanitizeTheme({ ...prev, ...user.theme_settings });
        localStorage.setItem('elite_theme_settings', JSON.stringify(next));
        localStorage.setItem('theme', next.mode);
        return next;
      });
    }
  }, [user]);

  useEffect(() => {
    const hasUserSelected = localStorage.getItem('elite_theme_user_selected') === 'true';
    if (hasUserSelected) return;
    if (!user?.school_id && user?.role !== 'SuperAdmin') return;

    api.get('/schools/theme')
      .then((res) => {
        if (res.data?.theme_settings) {
          setSettings((prev) => {
            const next = sanitizeTheme({ ...prev, ...res.data.theme_settings });
            localStorage.setItem('elite_theme_settings', JSON.stringify(next));
            localStorage.setItem('theme', next.mode);
            return next;
          });
        }
      })
      .catch(() => {});
  }, [user?.school_id, user?.role]);

  const syncToBackend = useCallback((next) => {
    if (user?.role !== 'Admin' && user?.role !== 'SuperAdmin') return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        setIsSyncing(true);
        const res = await api.patch('/schools/theme', next);
        if (res.data?.theme_settings && updateUser) {
          updateUser({ theme_settings: res.data.theme_settings });
        }
      } catch (err) {
        console.error('Failed to sync theme:', err);
      } finally {
        setIsSyncing(false);
      }
    }, 350);
  }, [user?.role, updateUser]);

  const updateThemeSetting = useCallback((key, value) => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    setSettings((prev) => {
      const next = sanitizeTheme({ ...prev, [key]: value });
      if (key === 'headerBg') {
        next.sidebarBg = value;
      }
      localStorage.setItem('elite_theme_user_selected', 'true');
      localStorage.setItem('elite_theme_settings', JSON.stringify(next));
      localStorage.setItem('theme', next.mode);
      syncToBackend(next);
      return next;
    });
  }, [syncToBackend]);

  const resetThemeToDefault = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    localStorage.removeItem('elite_theme_user_selected');
    localStorage.setItem('elite_theme_settings', JSON.stringify(DEFAULT_THEME));
    localStorage.setItem('theme', DEFAULT_THEME.mode);
    setSettings(DEFAULT_THEME);
    syncToBackend(DEFAULT_THEME);
  }, [syncToBackend]);

  const value = useMemo(
    () => ({
      themeSettings: settings,
      updateThemeSetting,
      resetThemeToDefault,
      isSyncing,
      isAnimating
    }),
    [settings, updateThemeSetting, resetThemeToDefault, isSyncing, isAnimating]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <ThemeTransition isAnimating={isAnimating} />
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext) || DEFAULT_THEME;
