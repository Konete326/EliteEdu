import { GraduationCap, Building2, Pencil, Eye, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

const GradeCard = ({
  grade,
  index,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  canReorder
}) => {
  const isActive = grade.status === 'Active';
  const campusName = grade.campus_id?.name || 'All Campuses';

  return (
    <div className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark space-y-3.5 shadow-2xs">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          {canReorder && (
            <div className="flex flex-col gap-1 shrink-0">
              <button
                type="button"
                disabled={isFirst}
                onClick={() => onMoveUp && onMoveUp(index)}
                className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl bg-surface-secondary/80 text-ink-muted hover:text-primary disabled:opacity-20 transition-colors cursor-pointer"
                title="Move Up"
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                disabled={isLast}
                onClick={() => onMoveDown && onMoveDown(index)}
                className="min-w-[38px] min-h-[38px] flex items-center justify-center rounded-xl bg-surface-secondary/80 text-ink-muted hover:text-primary disabled:opacity-20 transition-colors cursor-pointer"
                title="Move Down"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          )}
          <div>
            <h4 className="font-black text-sm text-ink dark:text-white">{grade.name}</h4>
            <div className="flex items-center gap-2 text-[10px] text-ink-muted font-medium mt-0.5">
              <span className="inline-flex items-center gap-1 font-semibold text-primary">
                <GraduationCap size={11} /> {grade.students_count || 0} Students
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Building2 size={11} /> {campusName}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleStatus && onToggleStatus(grade)}
          className={`min-h-[38px] px-3.5 py-1.5 flex items-center justify-center rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
            isActive
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
          }`}
        >
          {grade.status || 'Active'}
        </button>
      </div>

      {grade.class_teacher?.name && (
        <div className="text-[11px] text-ink-muted bg-surface-secondary/40 px-3 py-1.5 rounded-xl">
          <span className="font-semibold text-ink dark:text-white">Head Teacher:</span> {grade.class_teacher.name}
        </div>
      )}

      <div>
        <span className="text-[10px] uppercase font-bold text-ink-muted block mb-1.5">Sections &amp; Incharges:</span>
        <div className="flex flex-wrap gap-1.5">
          {grade.sections?.map((sec, i) => {
            const st = Array.isArray(grade.section_teachers)
              ? grade.section_teachers.find((item) => item.section === sec)
              : null;
            const teacherName = st?.teacher_id?.name;
            return (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20"
              >
                <span className="font-bold">Sec {sec}</span>
                {teacherName && (
                  <span className="text-[9px] text-ink-muted dark:text-ink-muted-dark border-l border-primary/30 pl-1 font-normal">
                    {teacherName}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 pt-2.5 border-t border-line/60 dark:border-line-dark/60">
        <button
          type="button"
          onClick={() => onView && onView(grade)}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="View Details"
        >
          <Eye size={16} />
        </button>
        <button
          type="button"
          onClick={() => onEdit && onEdit(grade)}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="Edit Class"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={() => onDelete && onDelete(grade)}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-ink-muted hover:text-bad hover:bg-bad/10 transition-colors cursor-pointer"
          title="Delete Class"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default GradeCard;
