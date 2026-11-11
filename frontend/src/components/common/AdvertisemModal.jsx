import { useState, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import ChapterPlayer from '../ui/chapter-player';
import { ADVERTISEM_CONFIG } from '../../config/advertisemConfig';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const AdvertisemModal = () => {
  const { user } = useAuth();
  const { themeSettings } = useTheme();

  const isDark = themeSettings?.mode === 'dark';
  const activeColor = themeSettings?.activeColor || '#0d9488';

  const [isOpen, setIsOpen] = useState(() => {
    if (!ADVERTISEM_CONFIG?.enabled) return false;
    if (!user) return false;
    const uId = String(user.id || user._id || '');
    try {
      const seen = localStorage.getItem(`eliteedu_advertisem_seen_${ADVERTISEM_CONFIG.releaseId}_${uId}`);
      return seen !== 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = useCallback(() => {
    const uId = String(user?.id || user?._id || '');
    if (uId && ADVERTISEM_CONFIG?.releaseId) {
      try {
        localStorage.setItem(`eliteedu_advertisem_seen_${ADVERTISEM_CONFIG.releaseId}_${uId}`, 'true');
      } catch {}
    }
    setIsOpen(false);
  }, [user]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleDismiss}
    >
      <div
        className="relative w-full max-w-lg bg-surface dark:bg-[#09090b] border border-line dark:border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[94vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
          <div>
            <h3 className="text-base sm:text-lg font-black text-ink dark:text-white tracking-tight">
              {ADVERTISEM_CONFIG.title}
            </h3>
            <p className="text-xs text-ink-muted">Discover the latest features added to your school workspace</p>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white hover:bg-surface-secondary dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ChapterPlayer
          chapters={ADVERTISEM_CONFIG.chapters}
          autoPlay={true}
          loop={false}
          isDark={isDark}
          activeColor={activeColor}
          brand="EliteEdu"
          onFinish={handleDismiss}
        />

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-ink-muted">Release: {ADVERTISEM_CONFIG.releaseId}</span>
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm"
            style={{ backgroundColor: activeColor }}
          >
            Got It
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default memo(AdvertisemModal);
