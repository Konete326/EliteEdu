import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { flushSync } from 'react-dom';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { DEFAULT_THEME, getActiveColorMeta } from '../utils/themeConstants';
import { useGlimm } from '../components/ui/glimm-transition';
import { updateThemeFavicon } from '../utils/pwaThemeIcon';

const ThemeContext = createContext(null);

const sanitizeTheme = (raw) => {
  const merged = { ...DEFAULT_THEME, ...(raw || {}) };
  if (merged.mode !== 'dark') merged.mode = 'light';
  if (!merged.headerBg) merged.headerBg = 'white';
  if (!merged.sidebarBg) merged.sidebarBg = merged.headerBg || 'white';
  if (merged.activeColor === '#4f46e5') merged.activeColor = DEFAULT_THEME.activeColor;
  return merged;
};

export const ThemeProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const glimm = useGlimm();
  const sweep = glimm?.sweep;

  const [settings, setSettings] = useState(() => {
    try {
      const c = localStorage.getItem('elite_theme_settings');
      if (c) return sanitizeTheme(JSON.parse(c));
      const rawMode = localStorage.getItem('theme');
      if (rawMode) return sanitizeTheme({ ...DEFAULT_THEME, mode: rawMode === 'dark' ? 'dark' : 'light' });
      return DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

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

    const themeColorHex = isDark
      ? '#09090b'
      : (t.headerBg && t.headerBg !== 'white' ? (meta.hex || '#ffffff') : '#ffffff');

    const metaTags = document.querySelectorAll('meta[name="theme-color"]');
    metaTags.forEach((tag) => tag.setAttribute('content', themeColorHex));

    d.style.backgroundColor = isDark ? '#09090b' : '#f2f5f6';
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('bg-[#09090b]', 'text-[#fafafa]');
      document.body.classList.toggle('dark', isDark);
      document.body.style.backgroundColor = isDark ? '#09090b' : '#f2f5f6';
    }

    updateThemeFavicon(isDark);
  }, []);

  useEffect(() => {
    applyThemeToDom(settings);
  }, [settings, applyThemeToDom]);

  useEffect(() => {
    if (!user) return;
    if (user.theme_settings?.mode) {
      setSettings((prev) => {
        const next = sanitizeTheme({ ...prev, ...user.theme_settings });
        localStorage.setItem('elite_theme_settings', JSON.stringify(next));
        localStorage.setItem('theme', next.mode);
        applyThemeToDom(next);
        return next;
      });
    }
  }, [user?.id, user?._id, user?.theme_settings, applyThemeToDom]);

  const syncToBackend = useCallback((next) => {
    if (!user) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        setIsSyncing(true);
        const res = await api.patch('/schools/theme', next);
        if (res.data?.theme_settings && updateUser) {
          updateUser({ theme_settings: res.data.theme_settings });
        }
      } catch (_) {
      } finally {
        setIsSyncing(false);
      }
    }, 300);
  }, [user, updateUser]);

  const updateThemeSetting = useCallback((key, value) => {
    const doUpdate = () => {
      flushSync(() => {
        setSettings((prev) => {
          const next = sanitizeTheme({ ...prev, [key]: value });
          if (key === 'headerBg') {
            next.sidebarBg = value;
          }
          localStorage.setItem('elite_theme_user_selected', 'true');
          localStorage.setItem('elite_theme_settings', JSON.stringify(next));
          localStorage.setItem('theme', next.mode);
          applyThemeToDom(next);
          syncToBackend(next);
          return next;
        });
      });
    };

    if (typeof sweep === 'function') {
      const isModeToggle = key === 'mode';
      const toDark = isModeToggle ? value === 'dark' : settings.mode === 'dark';
      sweep(doUpdate, {
        direction: isModeToggle ? (toDark ? 'ttb' : 'btt') : 'ltr',
        sweepMs: 650,
        outroMs: 180,
        midpoint: 0.5,
        palette: 'prism',
        waveAmount: 0.5,
        rippleAmount: 0.3,
        swellAmount: 0.6,
        brightness: 0.95
      });
    } else {
      doUpdate();
    }
  }, [sweep, applyThemeToDom, syncToBackend, settings.mode]);

  const resetThemeToDefault = useCallback(() => {
    const doReset = () => {
      flushSync(() => {
        localStorage.setItem('elite_theme_user_selected', 'true');
        localStorage.setItem('elite_theme_settings', JSON.stringify(DEFAULT_THEME));
        localStorage.setItem('theme', DEFAULT_THEME.mode);
        setSettings(DEFAULT_THEME);
        applyThemeToDom(DEFAULT_THEME);
        syncToBackend(DEFAULT_THEME);
      });
    };

    if (typeof sweep === 'function') {
      sweep(doReset, {
        direction: 'ltr',
        sweepMs: 650,
        outroMs: 180,
        midpoint: 0.5,
        palette: 'prism'
      });
    } else {
      doReset();
    }
  }, [sweep, applyThemeToDom, syncToBackend]);

  const value = useMemo(
    () => ({
      themeSettings: settings,
      updateThemeSetting,
      resetThemeToDefault,
      isSyncing,
      isAnimating: false
    }),
    [settings, updateThemeSetting, resetThemeToDefault, isSyncing]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext) || DEFAULT_THEME;
