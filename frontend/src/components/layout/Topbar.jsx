import { useState, useEffect } from 'react';
import { Menu, Sun, Moon, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../common/ConfirmModal';

const Topbar = ({ setMobileOpen }) => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <>
      <header className="h-16 px-4 sm:px-6 bg-surface dark:bg-surface-dark border-b border-line dark:border-line-dark flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark"
          >
            <Menu className="w-5 h-5" />
          </button>

          {user?.school_type && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-soft text-primary dark:bg-primary/20 dark:text-primary-dark">
              {user.school_type} School
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="h-5 w-px bg-line dark:bg-line-dark hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark flex items-center justify-center text-ink-muted">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:block text-left text-xs">
              <p className="font-semibold text-ink dark:text-ink-dark leading-tight">{user?.name}</p>
              <p className="text-ink-muted dark:text-ink-muted-dark capitalize">{user?.role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setConfirmLogout(true)}
            title="Sign out"
            className="p-2 rounded-lg text-ink-sub hover:text-bad hover:bg-bad-soft/50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <ConfirmModal
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={logout}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Yes, Sign Out"
        confirmStyle="danger"
      />
    </>
  );
};

export default Topbar;
