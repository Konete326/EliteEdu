import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Building2, ScanLine, Moon, Sun, Download, Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCampus } from '../../context/CampusContext';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import TopbarNotifications from './TopbarNotifications';
import TopbarMessages from './TopbarMessages';
import UniversalScannerModal from './scanner/UniversalScannerModal';
import VideoComingSoonModal from './VideoComingSoonModal';
import SearchableSelect from '../common/SearchableSelect';

const TopbarActions = ({ isDark, toggleTheme, isColored }) => {
  const { user } = useAuth();
  const { campuses, activeCampusId, requestCampusSwitch } = useCampus();
  const { isInstalled, promptInstall } = usePwaInstall();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setScannerOpen(false);
    setVideoModalOpen(false);
  }, [location.pathname]);

  const handleCampusSelect = useCallback((val) => {
    if (val === activeCampusId) return;
    const targetName = val === 'all'
      ? 'All Campuses'
      : (campuses.find((c) => String(c._id) === String(val))?.name || 'Selected Branch');
    requestCampusSwitch(val, targetName);
  }, [activeCampusId, campuses, requestCampusSwitch]);

  const getInitials = useCallback((name) => {
    if (!name) return 'ED';
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  }, []);

  const btnClass = isColored
    ? 'p-1.5 rounded-lg text-white/90 hover:bg-white/15 transition-colors'
    : 'p-1.5 rounded-lg text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark transition-colors';

  const schoolPill = user?.school_name || (user?.role === 'SuperAdmin' ? 'System HQ' : 'School');

  const campusOptions = useMemo(() => [
    { value: 'all', label: campuses.length > 0 ? 'All Campuses' : schoolPill },
    ...campuses.map((c) => ({
      value: c._id,
      label: c.name,
      subtext: c.code ? `Code: ${c.code}` : ''
    }))
  ], [campuses, schoolPill]);

  const handleOpenVideo = useCallback(() => setVideoModalOpen(true), []);
  const handleCloseVideo = useCallback(() => setVideoModalOpen(false), []);
  const handleOpenScanner = useCallback(() => setScannerOpen(true), []);
  const handleCloseScanner = useCallback(() => setScannerOpen(false), []);

  const handleProfileClick = useCallback(() => {
    navigate(user?.role === 'SuperAdmin' ? '/superadmin/profile' : user?.role === 'Teacher' ? '/teacher/profile' : '/admin/profile');
  }, [navigate, user?.role]);

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="hidden sm:block w-36 sm:w-44">
        <SearchableSelect
          options={campusOptions}
          value={activeCampusId}
          onChange={handleCampusSelect}
          placeholder="Select Campus..."
          icon={Building2}
          size="sm"
        />
      </div>

      <button
        type="button"
        onClick={handleOpenVideo}
        className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
          isColored ? 'bg-white/15 border-white/20 text-white hover:bg-white/25' : 'border-line dark:border-line-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark text-ink dark:text-ink-dark'
        }`}
      >
        <Play className={`w-3.5 h-3.5 shrink-0 ${isColored ? 'text-white fill-white/20' : 'text-primary fill-primary/20'}`} />
        <span>Watch Video</span>
      </button>

      <TopbarMessages isColored={isColored} btnClass={btnClass} />

      <button
        type="button"
        onClick={handleOpenScanner}
        className={btnClass}
        title="Universal QR & Barcode Scanner"
      >
        <ScanLine className="w-4 h-4" />
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
        onClick={handleProfileClick}
        className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border shrink-0 overflow-hidden cursor-pointer transition-all hover:scale-105 ${
          isColored ? 'bg-white/20 border-white/40 text-white' : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark border-primary/20'
        }`}
      >
        {user?.photo_url ? <img src={user.photo_url} alt={user.name || 'User'} className="w-full h-full object-cover" /> : getInitials(user?.name)}
      </button>

      <UniversalScannerModal isOpen={scannerOpen} onClose={handleCloseScanner} />
      <VideoComingSoonModal isOpen={videoModalOpen} onClose={handleCloseVideo} />
    </div>
  );
};

export default memo(TopbarActions);
