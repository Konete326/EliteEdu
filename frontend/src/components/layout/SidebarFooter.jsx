import { useNavigate } from 'react-router-dom';
import { PanelLeft, Moon, Sun, LogOut } from 'lucide-react';

const SidebarFooter = ({ user, isExpanded, onToggleCollapse, isDark, toggleTheme, onLogoutClick, isColored }) => {
  const navigate = useNavigate();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const profilePath = user?.role === 'SuperAdmin' ? '/superadmin/profile' : user?.role === 'Teacher' ? '/teacher/profile' : '/admin/profile';

  return (
    <div className={`border-t p-3 space-y-2.5 shrink-0 ${isColored ? 'border-white/15 bg-transparent text-white' : 'border-line dark:border-line-dark bg-surface dark:bg-surface-dark'}`}>
      <button
        type="button"
        onClick={() => navigate(profilePath)}
        title="View My Profile"
        className={`w-full flex items-center ${!isExpanded ? 'justify-center' : 'gap-3 px-1'} text-left p-1 rounded-xl transition-colors cursor-pointer group ${
          isColored ? 'hover:bg-white/10' : 'hover:bg-surface-secondary/70 dark:hover:bg-white/[0.04]'
        }`}
      >
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden transition-colors ${
          isColored ? 'bg-white/15 border-white/30 text-white' : 'bg-surface-secondary dark:bg-surface-secondary-dark border-line dark:border-line-dark text-ink dark:text-ink-dark group-hover:border-primary/50'
        }`}>
          {user?.photo_url ? (
            <img src={user.photo_url} alt={user.name || 'User'} className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>
        {isExpanded && (
          <div className="min-w-0 flex-1">
            <p className={`text-xs font-semibold truncate leading-tight transition-colors ${isColored ? 'text-white' : 'text-ink dark:text-ink-dark group-hover:text-primary'}`}>
              {user?.name || 'User'}
            </p>
            <p className={`text-[11px] lowercase truncate ${isColored ? 'text-white/70' : 'text-ink-muted dark:text-ink-muted-dark'}`}>
              {user?.role || 'user'}
            </p>
          </div>
        )}
      </button>

      <div className={`flex items-center ${!isExpanded ? 'flex-col gap-2' : 'justify-between px-1'}`}>
        <button
          type="button"
          onClick={onToggleCollapse}
          title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          className={`p-1.5 rounded-lg transition-colors ${isColored ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark'}`}
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`p-1.5 rounded-lg transition-colors ${isColored ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark'}`}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={onLogoutClick}
          title="Sign Out"
          className={`p-1.5 rounded-lg transition-colors ${isColored ? 'text-white/80 hover:text-red-300 hover:bg-white/10' : 'text-ink-sub hover:text-bad hover:bg-bad-soft/40'}`}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SidebarFooter;
