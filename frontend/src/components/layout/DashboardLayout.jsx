import { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageLoader from '../common/PageLoader';
import ConfirmModal from '../common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const DashboardLayout = () => {
  const { logout } = useAuth();
  const { themeSettings, updateThemeSetting } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const isDark = themeSettings.mode === 'dark';
  const toggleTheme = () => updateThemeSetting('mode', isDark ? 'light' : 'dark');

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
    </div>
  );
};

export default DashboardLayout;
