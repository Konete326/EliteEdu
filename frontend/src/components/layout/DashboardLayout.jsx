import { useState, Suspense, useCallback, useMemo, lazy } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PageLoader from '../common/PageLoader';
import ConfirmModal from '../common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const CampusSwitchModal = lazy(() => import('../common/CampusSwitchModal'));
const OnboardingWizardModal = lazy(() => import('../common/OnboardingWizardModal'));
const AdvertisemModal = lazy(() => import('../common/AdvertisemModal'));

const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const { themeSettings, updateThemeSetting } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const location = useLocation();

  const isDark = themeSettings.mode === 'dark';
  const toggleTheme = useCallback(() => {
    updateThemeSetting('mode', isDark ? 'light' : 'dark');
  }, [updateThemeSetting, isDark]);

  const handleOpenLogout = useCallback(() => setConfirmLogout(true), []);
  const handleCloseLogout = useCallback(() => setConfirmLogout(false), []);

  const showOnboarding = useMemo(() => {
    if (!user || user.role === 'SuperAdmin') return false;
    const uId = String(user.id || user._id || user.student_id || '');
    if (!uId) return false;
    try {
      if (localStorage.getItem(`eliteedu_onboarding_done_${uId}`) === 'true') return false;
      if (localStorage.getItem(`onboarding_dismissed_${uId}`) === 'true') return false;
    } catch {}
    if (user.onboarding_completed || user.onboarding_skipped) return false;
    if (user.onboarding_status === 'completed' || user.onboarding_status === 'skipped') return false;
    return user.first_login === true;
  }, [user]);

  const isChatRoute = useMemo(
    () => location.pathname.startsWith('/admin/messaging') || location.pathname.startsWith('/admin/messages'),
    [location.pathname]
  );

  const isCompactDesktopRoute = useMemo(
    () =>
      location.pathname.startsWith('/admin/students/promote') ||
      location.pathname.startsWith('/admin/control-panel/class-transfer') ||
      location.pathname.includes('/behavior-skills'),
    [location.pathname]
  );

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-bg dark:bg-bg-dark text-ink dark:text-ink-dark">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isDesktopOpen={isDesktopOpen}
        setIsDesktopOpen={setIsDesktopOpen}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onLogoutClick={handleOpenLogout}
      />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Topbar
          setMobileOpen={setMobileOpen}
          isDesktopOpen={isDesktopOpen}
          setIsDesktopOpen={setIsDesktopOpen}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
        <main className={`flex-1 min-h-0 flex flex-col ${isChatRoute ? 'p-2 sm:p-3 overflow-hidden' : isCompactDesktopRoute ? 'p-2.5 sm:p-4 lg:p-5 xl:overflow-hidden overflow-y-auto' : 'p-2.5 sm:p-6 lg:p-8 overflow-y-auto'}`}>
          <Suspense fallback={<PageLoader text="Loading section..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <ConfirmModal
        isOpen={confirmLogout}
        onClose={handleCloseLogout}
        onConfirm={logout}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Yes, Sign Out"
        confirmStyle="danger"
      />

      <Suspense fallback={null}>
        <CampusSwitchModal />
        {showOnboarding && <OnboardingWizardModal />}
        <AdvertisemModal />
      </Suspense>
    </div>
  );
};

export default DashboardLayout;
