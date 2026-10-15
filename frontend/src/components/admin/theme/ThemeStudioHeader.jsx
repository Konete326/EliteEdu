import { Palette, RotateCcw, Sparkles } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const ThemeStudioHeader = () => {
  const { resetThemeToDefault, isSyncing } = useTheme();

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark flex items-center justify-center shrink-0 shadow-xs">
          <Palette className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-ink dark:text-ink-dark">Theme & Appearance Studio</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark">
              <Sparkles className="w-2.5 h-2.5" />
              Live Studio
            </span>
          </div>
          <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">
            Configure institutional modes, layout placement, header gradients, and brand swatches
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-end md:self-center">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
          <span className="text-[11px]">{isSyncing ? 'Syncing...' : 'Auto-Saved • Live Preview'}</span>
        </div>

        <button
          type="button"
          onClick={(e) => resetThemeToDefault(e)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-line dark:border-line-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark text-xs font-semibold text-ink-sub dark:text-ink-sub-dark transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset to Default</span>
        </button>
      </div>
    </div>
  );
};

export default ThemeStudioHeader;
