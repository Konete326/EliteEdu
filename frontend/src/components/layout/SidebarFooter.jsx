import { PanelLeft, Moon, Sun, LogOut } from 'lucide-react';

const SidebarFooter = ({ user, isExpanded, onToggleCollapse, isDark, toggleTheme, onLogoutClick }) => {
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="border-t border-line dark:border-line-dark p-3 space-y-2.5 bg-surface dark:bg-surface-dark shrink-0">
      <div className={`flex items-center ${!isExpanded ? 'justify-center' : 'gap-3 px-1'}`}>
        <div className="w-8 h-8 rounded-full bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark flex items-center justify-center font-bold text-xs text-ink dark:text-ink-dark shrink-0">
          {initial}
        </div>
        {isExpanded && (
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-ink dark:text-ink-dark truncate leading-tight">
              {user?.name || 'User'}
            </p>
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark lowercase truncate">
              {user?.role || 'user'}
            </p>
          </div>
        )}
      </div>

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
