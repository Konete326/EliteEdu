import { Search, CheckCheck, Sparkles, X, Users } from 'lucide-react';
import PromotionStudentCard from './PromotionStudentCard';

const PromotionStudentGrid = ({
  candidates, grades, campuses, campusId, setCampusId,
  sourceGradeId, setSourceGradeId, search, setSearch,
  selectedIds, onToggleStudent, onSelectAll, onClearSelection, onSelectPassed,
  onScoreChange, passThreshold, setPassThreshold, loading
}) => {
  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or GR #..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={sourceGradeId} onChange={(e) => setSourceGradeId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary font-medium"
            >
              <option value="ALL">All Current Classes</option>
              {grades.map((g) => (<option key={g._id} value={g._id}>{g.name}</option>))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={campusId} onChange={(e) => setCampusId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary font-medium"
            >
              <option value="ALL">All Campuses</option>
              {campuses.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-line/60 dark:border-line-dark/60 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button" onClick={onSelectAll}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark hover:border-primary text-ink dark:text-ink-dark transition-all"
            >
              <CheckCheck className="w-3.5 h-3.5 text-primary" />
              <span>Select All</span>
            </button>
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <button
                type="button"
                onClick={() => onSelectPassed(passThreshold)}
                className="hover:underline font-bold"
              >
                Auto-Select Passed ≥
              </button>
              <input
                type="number"
                min="0"
                max="100"
                value={passThreshold}
                onChange={(e) => setPassThreshold?.(Number(e.target.value) || 0)}
                className="w-11 px-1 py-0.5 text-center text-xs font-bold rounded bg-surface dark:bg-surface-dark border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span>%</span>
            </div>
            <button
              type="button" onClick={onClearSelection}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-ink-muted hover:text-bad transition-all"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
          <span className="text-[11px] font-semibold text-ink-sub">
            {selectedIds.length} of {candidates.length} Selected
          </span>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-ink-muted">Loading students terminal...</div>
      ) : candidates.length === 0 ? (
        <div className="p-12 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-center space-y-2">
          <Users className="w-8 h-8 text-primary mx-auto opacity-70" />
          <h4 className="text-sm font-bold text-ink dark:text-ink-dark">No Students Found</h4>
          <p className="text-xs text-ink-muted">Adjust class or campus filters to view student records.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {candidates.map((s) => (
            <PromotionStudentCard
              key={s._id} student={s}
              isSelected={selectedIds.includes(s._id)}
              onToggle={() => onToggleStudent(s._id)}
              onScoreChange={onScoreChange}
              passThreshold={passThreshold}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionStudentGrid;
