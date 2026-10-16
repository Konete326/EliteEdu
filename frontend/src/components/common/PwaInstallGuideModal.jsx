import { X, Smartphone, Monitor, Share, PlusSquare, MoreVertical, Download } from 'lucide-react';

const PwaInstallGuideModal = ({ isOpen, onClose, platform }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-surface dark:bg-[#121212] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 flex items-center justify-center">
              {platform === 'desktop' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-ink dark:text-ink-dark">
                {platform === 'ios' ? 'Install on iOS / Safari' : platform === 'android' ? 'Install on Android' : 'Install on Desktop'}
              </h3>
              <p className="text-[11px] text-ink-muted">Quick 3-step setup</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {platform === 'ios' && (
          <div className="space-y-3 text-xs text-ink-sub dark:text-ink-sub-dark">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">1</span>
              <span>Open this URL in your iPhone/iPad Safari browser.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">2</span>
              <span className="flex items-center gap-1.5 flex-wrap">
                Tap the <Share className="w-3.5 h-3.5 text-primary inline" /> Share button in the Safari navigation bar.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">3</span>
              <span className="flex items-center gap-1.5 flex-wrap">
                Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-primary inline" /> &apos;Add to Home Screen&apos;.
              </span>
            </div>
          </div>
        )}

        {platform === 'android' && (
          <div className="space-y-3 text-xs text-ink-sub dark:text-ink-sub-dark">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">1</span>
              <span className="flex items-center gap-1.5 flex-wrap">
                Tap the three dots <MoreVertical className="w-3.5 h-3.5 text-primary inline" /> menu in Chrome/Edge.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">2</span>
              <span className="flex items-center gap-1.5 flex-wrap">
                Select <Download className="w-3.5 h-3.5 text-primary inline" /> &apos;Install app&apos; or &apos;Add to Home screen&apos;.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">3</span>
              <span>Confirm &apos;Install&apos; when the system prompt appears.</span>
            </div>
          </div>
        )}

        {platform === 'desktop' && (
          <div className="space-y-3 text-xs text-ink-sub dark:text-ink-sub-dark">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">1</span>
              <span>Look at your browser&apos;s address/URL bar at the top right.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">2</span>
              <span className="flex items-center gap-1.5 flex-wrap">
                Click the <Download className="w-3.5 h-3.5 text-primary inline" /> Install App icon in the address bar.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">3</span>
              <span>Or click browser menu (⋮) &gt; &apos;Install EliteEdu&apos;.</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default PwaInstallGuideModal;
