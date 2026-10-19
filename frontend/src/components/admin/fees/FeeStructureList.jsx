import { Edit2, Trash2, Landmark } from 'lucide-react';

const FeeStructureList = ({ structures = [], onEdit, onDelete, loading }) => {
  if (structures.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-surface dark:bg-surface-dark border border-line text-center space-y-2">
        <Landmark className="w-8 h-8 mx-auto text-ink-muted" />
        <h4 className="text-sm font-bold text-ink dark:text-ink-dark">No Fee Structures Configured</h4>
        <p className="text-xs text-ink-muted">Use the form on the left to set up class-wise fee heads and rates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">Active Class Structures ({structures.length})</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {structures.map((st) => {
          const grade = st.grade_id || {};
          const heads = Array.isArray(st.custom_heads) ? st.custom_heads : [];
          return (
            <div key={st._id} className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-xs space-y-2 text-xs hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <div>
                  <h4 className="font-black text-ink dark:text-ink-dark text-sm uppercase">{grade.name || 'Unknown Grade'}</h4>
                  <span className="text-[10px] text-ink-muted">Session: {st.academic_session} • Due Day: {st.due_day_of_month}th</span>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => onEdit(st)} className="p-1.5 rounded-lg border border-line text-ink-muted hover:text-primary hover:bg-surface-secondary">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => onDelete(st._id)} className="p-1.5 rounded-lg border border-line text-ink-muted hover:text-bad hover:bg-bad/10">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-surface-secondary/50 border border-line/60">
                  <span className="text-ink-muted block text-[10px]">Tuition Fee</span>
                  <span className="font-bold font-mono text-primary">PKR {Number(st.tuition_fee).toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-xl bg-surface-secondary/50 border border-line/60">
                  <span className="text-ink-muted block text-[10px]">Exam Fee</span>
                  <span className="font-bold font-mono text-ink">PKR {Number(st.exam_fee || 0).toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-xl bg-surface-secondary/50 border border-line/60">
                  <span className="text-ink-muted block text-[10px]">Computer Lab</span>
                  <span className="font-bold font-mono text-ink">PKR {Number(st.computer_lab_fee || 0).toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-xl bg-surface-secondary/50 border border-line/60">
                  <span className="text-ink-muted block text-[10px]">Late Fine</span>
                  <span className="font-bold font-mono text-bad">PKR {Number(st.late_fine_amount || 200).toLocaleString()}</span>
                </div>
              </div>

              {heads.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {heads.map((h, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-surface-secondary border border-line text-[10px] text-ink-muted font-medium">
                      {h.title}: <strong className="text-ink font-mono">Rs. {Number(h.amount).toLocaleString()}</strong>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeeStructureList;
