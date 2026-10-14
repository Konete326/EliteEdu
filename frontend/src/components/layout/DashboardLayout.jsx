import { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageLoader from '../common/PageLoader';
import ConfirmModal from '../common/ConfirmModal';
import ThemeTransition from '../common/ThemeTransition';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [transitionState, setTransitionState] = useState({ isAnimating: false, isClosed: false });

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
    if (transitionState.isAnimating) return;
    setTransitionState({ isAnimating: true, isClosed: false });
    requestAnimationFrame(() => {
      setTransitionState({ isAnimating: true, isClosed: true });
    });

    setTimeout(() => {
      const next = !isDark;
      setIsDark(next);
      document.documentElement.classList.toggle('dark', next);
      document.documentElement.setAttribute('data-bs-theme', next ? 'dark' : 'light');
      localStorage.setItem('theme', next ? 'dark' : 'light');
    }, 300);

    setTimeout(() => {
      setTransitionState({ isAnimating: true, isClosed: false });
    }, 650);

    setTimeout(() => {
      setTransitionState({ isAnimating: false, isClosed: false });
    }, 950);
  };

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-bg dark:bg-bg-dark text-ink dark:text-ink-dark">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isDesktopOpen={isDesktopOpen}
        setIsDesktopOpen={setIsDesktopOpen}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onLogoutClick={() => setConfirmLogout(true)}
      />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Topbar
          setMobileOpen={setMobileOpen}
          isDesktopOpen={isDesktopOpen}
          setIsDesktopOpen={setIsDesktopOpen}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Suspense fallback={<PageLoader text="Loading section..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <ConfirmModal
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={logout}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Yes, Sign Out"
        confirmStyle="danger"
      />
      <ThemeTransition isAnimating={transitionState.isAnimating} isClosed={transitionState.isClosed} />
    </div>
  );
};

export default DashboardLayout;
