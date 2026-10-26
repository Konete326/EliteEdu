import { RefreshCw, GraduationCap, CheckCircle2, Award, History } from 'lucide-react';

const PromotionHeaderBanner = ({ candidates, passThreshold, setPassThreshold, selectedCount, recentPromotions, onReload, loading }) => {
  const eligibleCount = candidates.filter((s) => (s.calculated_exam_percentage ?? s.exam_percentage ?? 0) >= passThreshold).length;

  return (
    <div className="space-y-2.5 pb-2.5 border-b border-line dark:border-line-dark">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <span>Students</span>
            <span>/</span>
            <span className="font-semibold text-ink dark:text-ink-dark">Promote Students & Class Transfer</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-ink dark:text-ink-dark tracking-tight mt-0.5">
            Student Promotion Terminal (POS)
          </h1>
        </div>

        <button
          type="button" onClick={onReload} disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark hover:bg-surface-secondary transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
          <span>Reload</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted">Candidates</span>
            <div className="text-base font-black text-ink dark:text-ink-dark">{candidates.length}</div>
          </div>
          <GraduationCap className="w-4 h-4 text-primary opacity-80" />
        </div>
        <div className="p-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted">Passing Criteria</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs font-bold text-emerald-600">≥</span>
              <input
                type="number"
                min="0"
                max="100"
                value={passThreshold}
                onChange={(e) => setPassThreshold?.(Number(e.target.value) || 0)}
                className="w-11 px-1 py-0.5 text-sm font-black text-emerald-600 dark:text-emerald-400 rounded bg-emerald-500/10 border border-emerald-500/30 text-center outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-emerald-600">%</span>
            </div>
          </div>
          <Award className="w-4 h-4 text-emerald-500 opacity-80" />
        </div>
        <div className="p-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted">Auto-Eligible</span>
            <div className="text-base font-black text-primary">{eligibleCount}</div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-primary opacity-80" />
        </div>
        <div className="p-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-muted">In POS Queue</span>
            <div className="text-base font-black text-ink dark:text-ink-dark">{selectedCount}</div>
          </div>
          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px]">{selectedCount}</div>
        </div>
      </div>

      {recentPromotions.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center gap-1 text-[11px] font-bold text-ink-muted shrink-0">
            <History className="w-3.5 h-3.5 text-primary" />
            <span>Recent Class Transitions:</span>
          </div>
          {recentPromotions.map((p) => (
            <span key={p._id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 shrink-0">
              <span>✓ {p.from_grade_name} → {p.to_grade_name} ({p.promoted_count} Promoted)</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionHeaderBanner;
