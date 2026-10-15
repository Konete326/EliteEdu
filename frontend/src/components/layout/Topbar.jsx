import { useLocation } from 'react-router-dom';
import {
  PanelLeft, Home, Search, Building2, ChevronsUpDown,
  LayoutGrid, MessageCircle, PhoneCall, Bell, Moon, Sun, Download, Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { useComingSoon } from '../../context/ComingSoonContext';
import { getRouteTitle } from '../../config/adminNavConfig';

const Topbar = ({ setMobileOpen, setIsDesktopOpen, isDark, toggleTheme }) => {
  const { user } = useAuth();
  const { openComingSoon } = useComingSoon();
  const { isInstalled, promptInstall } = usePwaInstall();
  const location = useLocation();
  const pageTitle = getRouteTitle(location.pathname);

  const getInitials = (name) => {
    if (!name) return 'ED';
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  };

  const handleMenuClick = () => {
    if (window.innerWidth >= 1024) setIsDesktopOpen((prev) => !prev);
    else setMobileOpen(true);
  };

  const schoolPill = user?.school_name || (user?.role === 'SuperAdmin' ? 'System HQ' : 'School');

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
        <button
          type="button"
          onClick={() => openComingSoon({
            title: 'Campus & Branch Switcher',
            description: 'Quick branch switching and campus selection will be available here soon.',
            badge: 'Campuses'
          })}
          title={schoolPill}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-xs font-medium text-ink dark:text-ink-dark hover:border-primary/50 transition-colors"
        >
          <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate max-w-[180px] capitalize">{schoolPill}</span>
          <ChevronsUpDown className="w-3 h-3 text-ink-muted shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => openComingSoon({
            title: 'Video Guides & Tutorials',
            description: 'Feature demonstrations, administrative walkthroughs, and tutorial videos will be accessible here soon.',
            badge: 'Video Tutorials'
          })}
          title="Watch Video Tutorials"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark text-xs font-semibold text-ink dark:text-ink-dark transition-colors shadow-xs"
        >
          <Play className="w-3.5 h-3.5 text-primary fill-primary/20 shrink-0" />
          <span>Watch Video</span>
        </button>

        <button
          type="button"
          onClick={() => openComingSoon({
            title: 'Quick Modules Launcher',
            description: 'Institutional app drawer and shortcut launcher is currently in active development.',
            badge: 'Modules'
          })}
          title="Modules"
          className="p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => openComingSoon({
              title: 'Live Chat & Messaging',
              description: 'Real-time internal chat between staff, management, and teachers will be enabled here soon.',
              badge: 'Messaging'
            })}
            title="Messages"
            className="p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-bad text-white text-[9px] font-bold flex items-center justify-center leading-none">
            2
          </span>
        </div>

        <button
          type="button"
          onClick={() => openComingSoon({
            title: 'Helpdesk & Support Center',
            description: 'Direct institutional support, emergency contact, and administrative ticketing are coming soon.',
            badge: 'Support'
          })}
          title="Support"
          className="p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors"
        >
          <PhoneCall className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => openComingSoon({
            title: 'Notifications & Alerts Feed',
            description: 'Real-time school alerts, academic announcements, and reminder notifications are coming soon.',
            badge: 'Notifications'
          })}
          title="Notifications"
          className="p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors"
        >
          <Bell className="w-4 h-4" />
        </button>

        {!isInstalled && (
          <button
            type="button"
            onClick={promptInstall}
            title="Install EliteEdu App"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all text-xs font-bold shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Install App</span>
          </button>
        )}

        <button type="button" onClick={toggleTheme} title={isDark ? 'Light Mode' : 'Dark Mode'} className="p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-transform active:scale-95">
          {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => openComingSoon({
            title: 'Staff Profile & Settings',
            description: 'Profile customization, security credentials, active sessions, and personal preferences will be accessible here soon.',
            badge: 'My Profile'
          })}
          title="My Profile"
          className="w-8 h-8 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0 hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer"
        >
          {getInitials(user?.name)}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
