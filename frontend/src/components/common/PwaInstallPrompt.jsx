import { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share, PlusSquare, Sparkles } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';

const PwaInstallPrompt = () => {
  const {
    isInstalled,
    showPrompt,
    promptInstall,
    closePrompt,
    isIos,
    showIosGuide,
    setShowIosGuide
  } = usePwaInstall();

  const [progressWidth, setProgressWidth] = useState(100);

  useEffect(() => {
    if (!showPrompt) {
      setProgressWidth(100);
      return;
    }

    const interval = 100;
    const step = 100 / (10000 / interval);

    const timer = setInterval(() => {
      setProgressWidth((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return Math.max(0, prev - step);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [showPrompt]);

  if (isInstalled || !showPrompt) {
    if (showIosGuide) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-surface dark:bg-[#121212] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-line dark:border-white/10">
              <h3 className="font-bold text-sm text-ink dark:text-ink-dark flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>Install on iOS / Safari</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-ink-sub dark:text-ink-sub-dark">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">1</span>
                <span>Open this page in Safari browser.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">2</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  Tap the <Share className="w-3.5 h-3.5 text-primary inline" /> Share button in the Safari bottom bar.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">3</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-primary inline" /> &apos;Add to Home Screen&apos;.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <div className="fixed top-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-88 z-50 select-none animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="relative overflow-hidden rounded-2xl bg-surface/95 dark:bg-[#121212]/95 backdrop-blur-md border border-line dark:border-white/10 shadow-2xl p-4 transition-all">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-primary/20 shrink-0">
                E
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-ink dark:text-ink-dark">Install EliteEdu</h4>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark">
                    APP
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted">
                  Quick access & smoother performance
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closePrompt}
              aria-label="Close install prompt"
              className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-3.5">
            <button
              type="button"
              onClick={promptInstall}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-98"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
            <button
              type="button"
              onClick={closePrompt}
              className="px-3 py-1.5 rounded-xl border border-line dark:border-white/10 text-xs font-semibold text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors"
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

      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-surface dark:bg-[#121212] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-line dark:border-white/10">
              <h3 className="font-bold text-sm text-ink dark:text-ink-dark flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>Install on iOS / Safari</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-ink-sub dark:text-ink-sub-dark">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">1</span>
                <span>Open this page in Safari browser.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">2</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  Tap the <Share className="w-3.5 h-3.5 text-primary inline" /> Share button in the Safari bottom bar.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">3</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-primary inline" /> &apos;Add to Home Screen&apos;.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PwaInstallPrompt;
