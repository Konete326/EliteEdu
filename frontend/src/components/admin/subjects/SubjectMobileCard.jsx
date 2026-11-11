import { Pencil, Trash2, UserCheck, BookOpen, Layers, Building2 } from 'lucide-react';
import SubjectToggle from './SubjectToggle';
import { formatClassesLabel } from '../../../utils/curriculumPresets';

const SubjectMobileCard = ({ subject, onEdit, onDelete, onToggle, isToggling }) => {
  const classesLabel = formatClassesLabel(subject.classes);
  const isElective = subject.subject_type === 'Elective' || !subject.mandatory;
  const campusName = subject.campus_id?.name || 'All Campuses';
  const teacherName = subject.assigned_teacher?.name;
  const totalMarks = (subject.theory_marks || 0) + (subject.practical_marks || 0);

  return (
    <div className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark space-y-3 shadow-2xs">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <BookOpen size={18} />
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-sm text-ink dark:text-white truncate">{subject.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-primary/10 text-primary">
                {subject.code}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  isElective
                    ? 'bg-accent/15 text-accent border border-accent/20'
                    : 'bg-good/15 text-good border border-good/20'
                }`}
              >
                {isElective ? 'Elective' : 'Compulsory'}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <SubjectToggle
            active={subject.status === 'Active'}
            onToggle={() => onToggle(subject._id, 'status')}
            loading={isToggling}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] bg-surface-secondary/40 p-2.5 rounded-xl">
        <div>
          <span className="text-[10px] uppercase font-bold text-ink-muted block">Classes</span>
          <span className="font-semibold text-ink dark:text-white truncate block">{classesLabel}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-ink-muted block">Load / Marks</span>
          <span className="font-semibold text-ink dark:text-white">
            {subject.periods_per_week || 5} per wk • {totalMarks}m
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-ink-muted px-1">
        <div className="flex items-center gap-1 truncate max-w-[180px]">
          <Building2 size={12} className="shrink-0 text-primary" />
          <span className="truncate">{campusName}</span>
        </div>
        {teacherName ? (
          <div className="flex items-center gap-1 font-semibold text-ink dark:text-white truncate max-w-[150px]">
            <UserCheck size={12} className="shrink-0 text-good" />
            <span className="truncate">{teacherName}</span>
          </div>
        ) : (
          <span className="italic text-[10px]">No teacher</span>
        )}
      </div>

      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-line/60 dark:border-line-dark/60">
        <button
          type="button"
          onClick={() => onEdit(subject)}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          title="Edit Subject"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(subject)}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-ink-muted hover:text-bad hover:bg-bad/10 transition-colors cursor-pointer"
          title="Delete Subject"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default SubjectMobileCard;

