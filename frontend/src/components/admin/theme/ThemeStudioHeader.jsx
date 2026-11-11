import { Palette, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const ThemeStudioHeader = () => {
  const { resetThemeToDefault, isSyncing } = useTheme();

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-4 sm:mb-6 px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
          <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-ink dark:text-ink-dark tracking-tight">Theme &amp; Appearance</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              Live Studio
            </span>
          </div>
          <p className="hidden sm:block text-xs font-semibold text-ink-muted">
            Configure institutional color schemes, layout placement, header styles and brand swatches
          </p>
        </div>
      </div>

      <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
          <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span className="text-[10px] sm:text-[11px] font-semibold">{isSyncing ? 'Syncing...' : 'Auto-Saved'}</span>
        </div>

        <button
          type="button"
          onClick={(e) => resetThemeToDefault(e)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark hover:bg-surface-secondary text-xs font-semibold text-ink-muted hover:text-ink transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Default</span>
        </button>
      </div>
    </div>
  );
};

export default ThemeStudioHeader;
