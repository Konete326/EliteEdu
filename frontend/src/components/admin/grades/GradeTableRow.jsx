import { GripVertical, ChevronUp, ChevronDown, Eye, Pencil, Trash2, GraduationCap, Building2 } from 'lucide-react';

const GradeTableRow = ({
  grade,
  index,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  isDragged,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  canReorder
}) => {
  const isActive = grade.status === 'Active';
  const campusName = grade.campus_id?.name || 'All Campuses';

  return (
    <tr
      draggable={canReorder}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
      className={`transition-colors group ${
        isDragged
          ? 'opacity-30 bg-primary/20'
          : isDragOver
          ? 'bg-primary/5 border-t-2 border-primary'
          : 'hover:bg-surface-secondary/50 dark:hover:bg-white/5'
      }`}
    >
      <td className="py-3 px-3.5">
        <div className="flex items-center gap-2">
          {canReorder && (
            <div className="flex items-center gap-0.5 shrink-0">
              <span
                className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-surface-secondary text-ink-muted hover:text-primary transition-colors"
                title="Drag to reorder sequence"
              >
                <GripVertical size={14} />
              </span>
              <button
                type="button"
                disabled={isFirst}
                onClick={() => onMoveUp && onMoveUp(index)}
                className="p-0.5 rounded text-ink-muted hover:text-primary disabled:opacity-20 cursor-pointer"
                title="Move Up"
              >
                <ChevronUp size={13} />
              </button>
              <button
                type="button"
                disabled={isLast}
                onClick={() => onMoveDown && onMoveDown(index)}
                className="p-0.5 rounded text-ink-muted hover:text-primary disabled:opacity-20 cursor-pointer"
                title="Move Down"
              >
                <ChevronDown size={13} />
              </button>
            </div>
          )}

          <div className="min-w-0">
            <span className="font-bold text-xs text-ink dark:text-white truncate block">
              {grade.name}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-ink-muted font-semibold">
              <GraduationCap size={10} className="text-info dark:text-info-dark" />
              <span>{grade.students_count || 0} Students</span>
            </span>
          </div>
        </div>
      </td>

      <td className="py-3 px-3.5">
        <div className="flex flex-wrap gap-1 items-center">
          {grade.sections?.map((sec, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20"
            >
              {sec}
            </span>
          ))}
        </div>
      </td>

      <td className="py-3 px-3.5 text-xs text-ink dark:text-white font-medium">
        {grade.class_teacher?.name ? (
          <div>
            <p className="font-bold truncate max-w-[140px]">{grade.class_teacher.name}</p>
            <p className="text-[10px] text-ink-muted truncate max-w-[140px]">{grade.class_teacher.designation || 'Class Teacher'}</p>
          </div>
        ) : (
          <span className="text-ink-muted text-[11px] italic">Unassigned</span>
        )}
      </td>

      <td className="py-3 px-3.5 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1 font-semibold text-[11px] truncate max-w-[130px]">
          <Building2 size={11} className="text-primary shrink-0" />
          <span className="truncate">{campusName}</span>
        </span>
      </td>

      <td className="py-3 px-3.5 text-center">
        <button
          type="button"
          onClick={() => onToggleStatus(grade)}
          className={`w-9 h-5 rounded-full transition-colors relative p-0.5 inline-flex items-center cursor-pointer ${
            isActive ? 'bg-primary' : 'bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark'
          }`}
          title={isActive ? 'Click to deactivate' : 'Click to activate'}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              isActive ? 'translate-x-4' : 'translate-x-0 bg-ink-muted'
            }`}
          />
        </button>
      </td>

      <td className="py-3 px-3.5 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onView(grade)}
            title="View Details"
            className="p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(grade)}
            title="Edit Class"
            className="p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(grade)}
            title="Delete Class"
            className="p-1.5 rounded-lg text-ink-muted hover:text-bad hover:bg-bad/10 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default GradeTableRow;
