import { useState, useEffect, useCallback, useRef } from 'react';
import { Download, X } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import PwaInstallGuideModal from './PwaInstallGuideModal';

const PwaInstallPrompt = () => {
  const {
    isInstalled,
    showPrompt,
    promptInstall,
    closePrompt,
    showGuide,
    closeGuide,
    guidePlatform
  } = usePwaInstall();

  const [progressWidth, setProgressWidth] = useState(100);
  const [isClosing, setIsClosing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isClosingRef = useRef(false);

  const handleDismiss = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);
    setTimeout(() => {
      closePrompt();
      setIsClosing(false);
      isClosingRef.current = false;
      setProgressWidth(100);
    }, 300);
  }, [closePrompt]);

  useEffect(() => {
    if (!showPrompt) {
      setProgressWidth(100);
      setIsClosing(false);
      isClosingRef.current = false;
      return;
    }

    const interval = 100;
    const duration = 10000;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      if (isPaused) return;

      setProgressWidth((prev) => {
        if (prev - step <= 0) {
          clearInterval(timer);
          handleDismiss();
          return 0;
        }
        return Math.max(0, prev - step);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [showPrompt, isPaused, handleDismiss]);

  return (
    <>
      {!isInstalled && showPrompt && (
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={`fixed top-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-88 z-50 select-none transition-all duration-300 ${
            isClosing
              ? 'opacity-0 -translate-y-4 pointer-events-none'
              : 'opacity-100 translate-y-0 animate-in fade-in slide-in-from-top-4 duration-300'
          }`}
        >
          <div className="relative overflow-hidden rounded-2xl bg-surface/95 dark:bg-[#121212]/95 backdrop-blur-md border border-line dark:border-white/10 shadow-2xl p-4 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="EliteEdu" className="w-10 h-10 object-contain shrink-0 drop-shadow-sm" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-ink dark:text-ink-dark">Install EliteEdu</h4>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark">
                      APP
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-muted">Quick access & smoother performance</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Close install prompt"
                className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-3.5">
              <button
                type="button"
                onClick={promptInstall}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-98 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="px-3 py-1.5 rounded-xl border border-line dark:border-white/10 text-xs font-semibold text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Later
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-secondary dark:bg-white/5">
              <div
                className="h-full bg-primary transition-all duration-100 ease-linear"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <PwaInstallGuideModal
        isOpen={showGuide}
        onClose={closeGuide}
        platform={guidePlatform}
      />
    </>
  );
};

export default PwaInstallPrompt;
