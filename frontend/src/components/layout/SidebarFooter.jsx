import { useNavigate } from 'react-router-dom';
import { PanelLeft, Moon, Sun, LogOut } from 'lucide-react';

const SidebarFooter = ({ user, isExpanded, onToggleCollapse, isDark, toggleTheme, onLogoutClick }) => {
  const navigate = useNavigate();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const profilePath = user?.role === 'SuperAdmin' ? '/superadmin/profile' : user?.role === 'Teacher' ? '/teacher/profile' : '/admin/profile';

  return (
    <div className="border-t border-line dark:border-line-dark p-3 space-y-2.5 bg-surface dark:bg-surface-dark shrink-0">
      <button
        type="button"
        onClick={() => navigate(profilePath)}
        title="View My Profile"
        className={`w-full flex items-center ${!isExpanded ? 'justify-center' : 'gap-3 px-1'} text-left p-1 rounded-xl hover:bg-surface-secondary/70 dark:hover:bg-white/[0.04] transition-colors cursor-pointer group`}
      >
        <div className="w-8 h-8 rounded-full bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark flex items-center justify-center font-bold text-xs text-ink dark:text-ink-dark shrink-0 overflow-hidden group-hover:border-primary/50 transition-colors">
          {user?.photo_url ? (
            <img src={user.photo_url} alt={user.name || 'User'} className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>
        {isExpanded && (
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-ink dark:text-ink-dark truncate leading-tight group-hover:text-primary transition-colors">
              {user?.name || 'User'}
            </p>
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark lowercase truncate">
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
          className="p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={onLogoutClick}
          title="Sign Out"
          className="p-1.5 rounded-lg text-ink-sub hover:text-bad hover:bg-bad-soft/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SidebarFooter;
