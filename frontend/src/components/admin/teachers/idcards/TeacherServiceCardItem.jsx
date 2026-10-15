import { CheckSquare, Square, Edit3 } from 'lucide-react';
import TeacherServiceCardFront from './TeacherServiceCardFront';
import TeacherServiceCardBack from './TeacherServiceCardBack';

const TeacherServiceCardItem = ({
  teacher,
  selectedStyle = 'GovtSindh',
  sideMode = 'front',
  isSelected = true,
  onToggleSelect,
  onEditTeacher,
  config = {}
}) => {
  return (
    <div className="flex flex-col items-center gap-2 group print:m-0 print:p-0">
      <div className="flex items-center justify-between w-full max-w-[94mm] px-1 print:hidden">
        <button
          type="button"
          onClick={() => onToggleSelect(teacher._id)}
          className="flex items-center gap-1.5 text-xs font-bold text-ink dark:text-ink-dark hover:text-primary transition-colors"
        >
          {isSelected ? (
            <CheckSquare className="w-4 h-4 text-primary" />
          ) : (
            <Square className="w-4 h-4 text-ink-muted" />
          )}
          <span className="truncate max-w-[120px]">{teacher.name}</span>
        </button>

        <button
          type="button"
          onClick={() => onEditTeacher(teacher)}
          className="p-1 rounded-lg text-ink-muted hover:text-primary hover:bg-surface-secondary text-[11px] font-semibold flex items-center gap-1"
          title="Edit Card Fields"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      <div className={`space-y-2 print:space-y-0 ${!isSelected ? 'opacity-40 grayscale' : ''}`}>
        {(sideMode === 'front' || sideMode === 'both') && (
          <TeacherServiceCardFront teacher={teacher} config={config} style={selectedStyle} />
        )}
        {(sideMode === 'back' || sideMode === 'both') && (
          <TeacherServiceCardBack teacher={teacher} config={config} style={selectedStyle} />
        )}
      </div>
    </div>
  );
};

export default TeacherServiceCardItem;
