import { UserCheck, X } from 'lucide-react';

const TimetableSubstitutionRow = ({ item, selectedSub, onSelectSub, onAssign, onCancel, submitting }) => {
  const { slot, period_no, start_time, end_time, absent_teacher, reason, free_teachers, substitution } = item;

  return (
    <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
      <div className="space-y-1 max-w-sm">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 font-bold text-[10px]">Period {period_no}</span>
          <span className="font-mono text-ink-muted text-[10px]">{start_time} - {end_time}</span>
          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 font-bold text-[10px]">{reason}</span>
        </div>
        <div className="font-bold text-ink dark:text-ink-dark text-sm">
          {slot.grade_id?.name || 'Class'} ({slot.section || 'A'}) • {slot.subject_id?.name || 'Subject'}
        </div>
        <div className="text-[11px] text-ink-muted">Absent: {absent_teacher?.name || 'Teacher'} ({absent_teacher?.designation || 'Faculty'})</div>
      </div>

      <div className="flex items-center gap-2">
        {substitution ? (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">Covered By</span>
              <span className="font-black text-emerald-700 dark:text-emerald-400">{substitution.substitute_teacher_id?.name}</span>
            </div>
            <button onClick={() => onCancel(substitution._id)} className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-lg ml-2" title="Cancel substitution">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedSub || ''}
              onChange={(e) => onSelectSub(slot._id, e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none text-xs focus:border-primary"
            >
              <option value="">Select Free Teacher ({free_teachers?.length || 0} Free)...</option>
              {free_teachers?.map((t) => (
                <option key={t._id} value={t._id}>{t.name} ({t.designation || 'Teacher'})</option>
              ))}
            </select>
            <button
              onClick={() => onAssign(slot._id)}
              disabled={submitting || !selectedSub}
              className="px-3.5 py-1.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {submitting ? 'Assigning...' : 'Assign Substitute'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableSubstitutionRow;
