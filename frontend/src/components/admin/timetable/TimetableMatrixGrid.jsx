import { Trash2, Plus, MapPin, User as UserIcon } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimetableMatrixGrid = ({
  slots = [], viewMode = 'class', bellSchedule, onOpenAssign, onDeleteSlot, canManage = true
}) => {
  const periodSlots = (bellSchedule?.slots || [])
    .filter((s) => s.slot_type === 'Period')
    .sort((a, b) => Number(a.period_index) - Number(b.period_index));

  const periods = periodSlots.length > 0
    ? periodSlots
    : [1, 2, 3, 4, 5, 6, 7].map((p) => ({ period_index: p, start_time: '', end_time: '', label: `P${p}` }));

  const getSlot = (day, pNo) => slots.find((s) => s.day_of_week === day && Number(s.period_no) === Number(pNo));

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-3xl border border-line dark:border-line-dark shadow-xs overflow-x-auto">
      <table className="w-full text-xs text-left border-collapse min-w-[760px]">
        <thead>
          <tr className="bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted dark:text-ink-muted-dark border-b border-line dark:border-line-dark">
            <th className="p-3.5 font-bold uppercase tracking-wider w-24">Day</th>
            {periods.map((p) => (
              <th key={p.period_index} className="p-3 font-bold text-center border-l border-line dark:border-line-dark min-w-[110px]">
                <div>Period {p.period_index}</div>
                {p.start_time && (
                  <div className="text-[10px] font-bold text-primary font-mono mt-0.5">
                    {p.start_time} – {p.end_time}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line dark:divide-line-dark">
          {DAYS.map((day) => (
            <tr key={day} className="hover:bg-surface-secondary/40 dark:hover:bg-surface-secondary-dark/40 transition-colors">
              <td className="p-3 font-bold text-ink dark:text-ink-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50">
                {day}
              </td>
              {periods.map((p) => {
                const slot = getSlot(day, p.period_index);
                if (!slot) {
                  return (
                    <td key={p.period_index} className="p-2 border-l border-line dark:border-line-dark text-center">
                      {canManage ? (
                        <button
                          type="button"
                          onClick={() => onOpenAssign?.(day, p.period_index, p)}
                          className="w-full py-3.5 rounded-xl border border-dashed border-line dark:border-line-dark hover:border-primary hover:bg-primary/5 text-ink-muted hover:text-primary text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                        >
                          <Plus className="w-3 h-3" /> Assign
                        </button>
                      ) : (
                        <span className="text-ink-muted/40">—</span>
                      )}
                    </td>
                  );
                }
                return (
                  <td key={p.period_index} className="p-2 border-l border-line dark:border-line-dark">
                    <div className="p-2.5 rounded-2xl bg-primary/10 dark:bg-primary/15 border border-primary/20 dark:border-primary/30 space-y-1 relative group shadow-xs">
                      <div className="font-bold text-ink dark:text-ink-dark truncate pr-5">
                        {slot.subject_id?.name || 'Subject'}
                      </div>
                      <div className="text-[11px] text-ink-sub dark:text-ink-sub-dark flex items-center gap-1 truncate">
                        <UserIcon className="w-2.5 h-2.5 text-primary" />
                        {viewMode === 'teacher'
                          ? `${slot.grade_id?.name || 'Class'} (${slot.section || 'A'})`
                          : (slot.teacher_id?.name || 'Teacher')}
                      </div>
                      <div className="text-[10px] text-ink-muted dark:text-ink-muted-dark flex items-center justify-between pt-0.5">
                        <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {slot.room_no}</span>
                        <span className="font-mono text-[9px] text-primary font-bold">{slot.start_time}</span>
                      </div>
                      {canManage && (
                        <button
                          type="button"
                          onClick={() => onDeleteSlot(slot._id)}
                          className="absolute top-1.5 right-1.5 p-1 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs rounded-lg opacity-0 group-hover:opacity-100 text-ink-muted hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableMatrixGrid;
