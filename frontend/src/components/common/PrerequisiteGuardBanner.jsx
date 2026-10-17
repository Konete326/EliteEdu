import { AlertTriangle, RefreshCw, Plus, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrerequisiteGuardBanner = ({
  prerequisites = [],
  onRefresh,
  onResetDraft,
  draftSavedAt
}) => {
  const missing = prerequisites.filter((p) => p && Number(p.count) === 0);

  if (missing.length === 0) {
    if (!draftSavedAt) return null;
    return (
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-[11px] text-green-700 dark:text-green-300">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-green-600 dark:text-green-400 shrink-0" />
          <span>Form progress is auto-saved locally in drafts ({draftSavedAt}).</span>
        </div>
        {onResetDraft && (
          <button
            type="button"
            onClick={onResetDraft}
            className="flex items-center gap-1 font-bold text-ink-muted hover:text-bad transition-colors cursor-pointer"
          >
            <RotateCcw size={12} /> Clear Draft
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wide">Required Prerequisite Entities Missing</h4>
            <p className="text-[11px] opacity-90">
              The following entities have 0 records in database. Your filled draft is preserved while you add them:
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface dark:bg-surface-dark border border-line text-[11px] font-bold text-ink dark:text-ink-dark hover:border-primary transition-colors cursor-pointer shadow-2xs"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          )}
          {onResetDraft && (
            <button
              type="button"
              onClick={onResetDraft}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface dark:bg-surface-dark border border-line text-[11px] font-bold text-ink-muted hover:text-bad transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw size={12} /> Reset Draft
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {missing.map((p) => (
          <Link
            key={p.name}
            to={p.addPath}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-2xs transition-colors"
          >
            <Plus size={13} /> {p.label || `Add ${p.name}`}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PrerequisiteGuardBanner;
