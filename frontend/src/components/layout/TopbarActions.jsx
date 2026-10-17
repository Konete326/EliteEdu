import { useNavigate } from 'react-router-dom';
import {
  Building2, ChevronsUpDown, LayoutGrid, MessageCircle,
  PhoneCall, Moon, Sun, Download, Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { useComingSoon } from '../../context/ComingSoonContext';
import TopbarNotifications from './TopbarNotifications';

const TopbarActions = ({ isDark, toggleTheme, isColored }) => {
  const { user } = useAuth();
  const { openComingSoon } = useComingSoon();
  const { isInstalled, promptInstall } = usePwaInstall();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return 'ED';
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  };

  const btnClass = isColored
    ? 'p-1.5 rounded-lg text-white/90 hover:bg-white/15 transition-colors'
    : 'p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors';

  const schoolPill = user?.school_name || (user?.role === 'SuperAdmin' ? 'System HQ' : 'School');

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={() => openComingSoon({ title: 'Campus & Branch Switcher', description: 'Quick branch switching and campus selection will be available soon.', badge: 'Campuses' })}
        title={schoolPill}
        className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
          isColored ? 'bg-white/15 border-white/20 text-white hover:bg-white/25' : 'bg-surface-secondary dark:bg-surface-secondary-dark border-line dark:border-line-dark text-ink dark:text-ink-dark hover:border-primary/50'
        }`}
      >
        <Building2 className={`w-3.5 h-3.5 shrink-0 ${isColored ? 'text-white' : 'text-primary'}`} />
        <span className="truncate max-w-[160px] capitalize">{schoolPill}</span>
        <ChevronsUpDown className={`w-3 h-3 shrink-0 ${isColored ? 'text-white/70' : 'text-ink-muted'}`} />
      </button>

      <button
        type="button"
        onClick={() => openComingSoon({ title: 'Video Guides & Tutorials', description: 'Feature walkthroughs and tutorial videos will be accessible here.', badge: 'Tutorials' })}
        className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
          isColored ? 'bg-white/15 border-white/20 text-white hover:bg-white/25' : 'border-line dark:border-line-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark text-ink dark:text-ink-dark'
        }`}
      >
        <Play className={`w-3.5 h-3.5 shrink-0 ${isColored ? 'text-white fill-white/20' : 'text-primary fill-primary/20'}`} />
        <span>Watch Video</span>
      </button>

      <button type="button" onClick={() => openComingSoon({ title: 'Quick Modules Launcher', description: 'Institutional app launcher is in development.', badge: 'Modules' })} className={btnClass} title="Modules">
        <LayoutGrid className="w-4 h-4" />
      </button>

      <div className="relative">
        <button type="button" onClick={() => openComingSoon({ title: 'Live Chat & Messaging', description: 'Internal staff messaging is coming soon.', badge: 'Chat' })} className={btnClass} title="Messages">
          <MessageCircle className="w-4 h-4" />
        </button>
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-bad text-white text-[9px] font-bold flex items-center justify-center leading-none">2</span>
      </div>

      <button type="button" onClick={() => openComingSoon({ title: 'Helpdesk & Support Center', description: 'Support ticketing is coming soon.', badge: 'Support' })} className={btnClass} title="Support">
        <PhoneCall className="w-4 h-4" />
      </button>

      <TopbarNotifications isColored={isColored} btnClass={btnClass} />

      {!isInstalled && (
        <button
          type="button"
          onClick={promptInstall}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
            isColored ? 'bg-white text-ink hover:bg-white/90' : 'bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark hover:bg-primary hover:text-white'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[11px]">Install</span>
        </button>
      )}

      <button type="button" onClick={toggleTheme} className={btnClass} title={isDark ? 'Light Mode' : 'Dark Mode'}>
        {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
      </button>

      <button
        type="button"
        onClick={() => navigate(user?.role === 'SuperAdmin' ? '/superadmin/profile' : user?.role === 'Teacher' ? '/teacher/profile' : '/admin/profile')}
        className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border shrink-0 overflow-hidden cursor-pointer transition-all hover:scale-105 ${
          isColored ? 'bg-white/20 border-white/40 text-white' : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark border-primary/20'
        }`}
      >
        {user?.photo_url ? <img src={user.photo_url} alt={user.name || 'User'} className="w-full h-full object-cover" /> : getInitials(user?.name)}
      </button>
    </div>
  );
};

export default TopbarActions;
