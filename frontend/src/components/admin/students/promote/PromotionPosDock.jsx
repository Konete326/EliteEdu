import { ArrowRight, CheckCircle2, X, Layers } from 'lucide-react';

const PromotionPosDock = ({
  candidates, grades, selectedIds, onRemoveStudent,
  sourceGradeId, targetGradeId, setTargetGradeId, targetSection, setTargetSection,
  mode, setMode, onPromoteClick, passThreshold, setPassThreshold, submitting
}) => {
  const sourceGrade = grades.find((g) => g._id === sourceGradeId);
  const targetGrade = grades.find((g) => g._id === targetGradeId);
  const selectedStudents = candidates.filter((s) => selectedIds.includes(s._id));
  const availableSections = targetGrade?.sections?.length ? targetGrade.sections : ['A', 'B', 'C', 'D'];

  return (
    <div className="sticky top-4 p-3 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs space-y-2.5">
      <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
        <Layers className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-bold text-ink dark:text-ink-dark">Promotion Checkout Dock</h3>
      </div>

      <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-center space-y-0.5">
        <div className="text-lg font-black text-primary dark:text-primary-dark">
          {mode === 'Auto_Criteria' ? 'Auto-Criteria Queue' : `${selectedIds.length} Students Selected`}
        </div>
        <p className="text-[10px] font-medium text-ink-sub">
          {mode === 'Auto_Criteria' ? `All students meeting ≥ ${passThreshold}% pass criteria` : 'Ready to transition to next academic grade'}
        </p>
      </div>

      <div className="p-2 rounded-lg bg-surface-secondary/40 dark:bg-surface-secondary-dark/40 border border-line/60 dark:border-line-dark/60 flex items-center justify-between text-xs font-bold text-ink dark:text-ink-dark">
        <span>{sourceGrade?.name || 'Current Class'}</span>
        <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="text-primary">{targetGrade?.name || 'Target Class'}</span>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1 text-[11px]">Target Class *</label>
          <select
            value={targetGradeId} onChange={(e) => setTargetGradeId(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-ink dark:text-ink-dark outline-none focus:border-primary font-bold text-xs"
          >
            <option value="">-- Select Target Grade --</option>
            {grades.map((g) => (<option key={g._id} value={g._id}>{g.name}</option>))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1 text-[11px]">Target Section</label>
          <select
            value={targetSection} onChange={(e) => setTargetSection(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-ink dark:text-ink-dark outline-none focus:border-primary font-bold text-xs"
          >
            {availableSections.map((sec) => {
              const val = typeof sec === 'string' ? sec : sec.name;
              return <option key={val} value={val}>Section {val}</option>;
            })}
          </select>
        </div>

        <div className="pt-0.5">
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1 text-[11px]">Promotion Mode</label>
          <div className="grid grid-cols-2 gap-1 p-0.5 rounded-xl bg-surface-secondary/60 dark:bg-surface-secondary-dark/60">
            <button
              type="button" onClick={() => setMode('Manual')}
              className={`py-1 rounded-lg text-[11px] font-bold transition-all ${mode === 'Manual' ? 'bg-surface dark:bg-surface-dark text-primary shadow-xs' : 'text-ink-muted'}`}
            >
              Manual Queue
            </button>
            <button
              type="button" onClick={() => setMode('Auto_Criteria')}
              className={`py-1 rounded-lg text-[11px] font-bold transition-all ${mode === 'Auto_Criteria' ? 'bg-surface dark:bg-surface-dark text-emerald-600 shadow-xs' : 'text-ink-muted'}`}
            >
              Auto Criteria (≥ {passThreshold}%)
            </button>
          </div>
          {mode === 'Auto_Criteria' && (
            <div className="flex items-center justify-between p-1.5 mt-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <span>Pass Criteria:</span>
              <div className="flex items-center gap-1">
                <span>≥</span>
                <input
                  type="number" min="0" max="100" value={passThreshold}
                  onChange={(e) => setPassThreshold?.(Number(e.target.value) || 0)}
                  className="w-11 px-1 py-0.5 text-center text-xs font-bold rounded bg-surface dark:bg-surface-dark border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 outline-none"
                />
                <span>%</span>
              </div>
            </div>
          )}
        </div>

        {mode === 'Manual' && selectedStudents.length > 0 && (
          <div className="space-y-1 pt-0.5">
            <span className="text-[10px] uppercase font-bold text-ink-muted">Receipt Queue</span>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
              {selectedStudents.map((s) => (
                <div key={s._id} className="flex items-center justify-between p-1 rounded-md bg-surface-secondary/60 text-[10px] font-medium text-ink dark:text-ink-dark">
                  <span className="truncate max-w-[170px]">{s.name} ({s.gr_number})</span>
                  <button type="button" onClick={() => onRemoveStudent(s._id)} className="p-0.5 rounded text-ink-muted hover:text-bad"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="button" onClick={onPromoteClick}
        disabled={submitting || !targetGradeId || (mode === 'Manual' && selectedIds.length === 0)}
        className="w-full py-2 rounded-xl font-black text-xs bg-primary hover:bg-primary-hover text-white shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>{submitting ? 'Promoting...' : 'Confirm & Execute Promotion'}</span>
      </button>
    </div>
  );
};

export default PromotionPosDock;
