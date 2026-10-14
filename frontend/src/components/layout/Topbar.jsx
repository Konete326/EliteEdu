import { useLocation } from 'react-router-dom';
import {
  PanelLeft, Home, Search, Building2, ChevronsUpDown,
  LayoutGrid, MessageCircle, PhoneCall, Bell, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getRouteTitle } from '../../config/adminNavConfig';

const Topbar = ({ setMobileOpen, setIsDesktopOpen, isDark, toggleTheme }) => {
  const { user } = useAuth();
  const location = useLocation();
  const pageTitle = getRouteTitle(location.pathname);

  const getInitials = (name) => {
    if (!name) return 'ED';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleMenuClick = () => {
    if (window.innerWidth >= 1024) setIsDesktopOpen((prev) => !prev);
    else setMobileOpen(true);
  };

  const schoolPill = user?.school_name || (user?.role === 'SuperAdmin' ? 'System HQ' : 'Campus');

  return (
    <header className="h-16 px-4 sm:px-6 bg-surface dark:bg-surface-dark border-b border-line dark:border-line-dark flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={handleMenuClick}
          aria-label="Toggle navigation menu"
          className="p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs text-ink-muted dark:text-ink-muted-dark truncate">
          <Home className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Home</span>
          <span className="hidden sm:inline">&gt;</span>
          <span className="font-semibold text-ink dark:text-ink-dark truncate">{pageTitle}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 pr-9 py-1.5 text-xs rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] px-1 py-0.5 rounded bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink-muted font-mono leading-none">
            ↑S
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-xs font-medium text-ink dark:text-ink-dark">
          <Building2 className="w-3.5 h-3.5 text-primary" />
          <span className="truncate max-w-[130px]">{schoolPill}</span>
          <ChevronsUpDown className="w-3 h-3 text-ink-muted shrink-0" />
        </div>

        <button type="button" title="Modules" className="p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors">
          <LayoutGrid className="w-4 h-4" />
        </button>

        <div className="relative">
          <button type="button" title="Messages" className="p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors">
            <MessageCircle className="w-4 h-4" />
          </button>
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-bad text-white text-[9px] font-bold flex items-center justify-center leading-none">
            2
          </span>
        </div>

        <button type="button" title="Support" className="p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors">
          <PhoneCall className="w-4 h-4" />
        </button>

        <button type="button" title="Notifications" className="p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        <button type="button" onClick={toggleTheme} title={isDark ? 'Light Mode' : 'Dark Mode'} className="p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-transform active:scale-95">
          {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0 cursor-default">
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
