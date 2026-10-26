import { useMemo, useCallback, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { PanelLeft, Home, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { HEADER_BG_PRESETS } from '../../utils/themeConstants';
import { getRouteTitle } from '../../config/adminNavConfig';
import TopbarActions from './TopbarActions';

const Topbar = ({ setMobileOpen, setIsDesktopOpen, isDark, toggleTheme }) => {
  const { themeSettings } = useTheme();
  const location = useLocation();
  const pageTitle = getRouteTitle(location.pathname);

  const activePreset = useMemo(
    () => HEADER_BG_PRESETS.find((p) => p.id === themeSettings.headerBg),
    [themeSettings.headerBg]
  );
  const isColored = Boolean(themeSettings.headerBg && themeSettings.headerBg !== 'white');

  const handleMenuClick = useCallback(() => {
    if (window.innerWidth >= 1024) setIsDesktopOpen((prev) => !prev);
    else setMobileOpen(true);
  }, [setIsDesktopOpen, setMobileOpen]);

  const headerBgClass = isColored && activePreset
    ? activePreset.headerClass
    : 'bg-surface dark:bg-surface-dark border-b border-line dark:border-line-dark text-ink dark:text-ink-dark';

  return (
    <header className={`h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 transition-colors duration-300 ${headerBgClass}`}>
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={handleMenuClick}
          aria-label="Toggle navigation menu"
          className={`p-1.5 rounded-lg transition-colors ${
            isColored ? 'text-white/90 hover:bg-white/15' : 'text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark'
          }`}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className={`flex items-center gap-2 text-xs truncate ${isColored ? 'text-white/70' : 'text-ink-muted dark:text-ink-muted-dark'}`}>
          <Home className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Home</span>
          <span className="hidden sm:inline">&gt;</span>
          <span className={`font-semibold truncate ${isColored ? 'text-white' : 'text-ink dark:text-ink-dark'}`}>{pageTitle}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isColored ? 'text-white/70' : 'text-ink-muted'}`} />
          <input
            type="text"
            placeholder="Search..."
            className={`w-full pl-8 pr-9 py-1.5 text-xs rounded-lg border transition-colors focus:outline-none focus:ring-1 ${
              isColored
                ? 'bg-white/15 border-white/25 text-white placeholder:text-white/60 focus:ring-white/40'
                : 'bg-surface-secondary dark:bg-surface-secondary-dark border-line dark:border-line-dark text-ink dark:text-ink-dark placeholder:text-ink-muted focus:ring-primary'
            }`}
          />
          <kbd className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] px-1 py-0.5 rounded border font-mono leading-none ${
            isColored ? 'bg-white/20 border-white/30 text-white/90' : 'bg-surface dark:bg-surface-dark border-line dark:border-line-dark text-ink-muted'
          }`}>
            ↑S
          </kbd>
        </div>
      </div>

      <TopbarActions isDark={isDark} toggleTheme={toggleTheme} isColored={isColored} />
    </header>
  );
};

export default memo(Topbar);
