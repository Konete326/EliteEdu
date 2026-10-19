import { GripVertical, Eye, Pencil, Trash2 } from 'lucide-react';

const GradeTableRow = ({
  grade,
  index,
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
          : 'hover:bg-surface-secondary/40'
      }`}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <span
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-surface-secondary text-ink-muted hover:text-primary transition-colors shrink-0"
            title="Drag and drop to reorder class sequence"
          >
            <GripVertical className="w-4 h-4" />
          </span>
          <span className="font-bold text-ink dark:text-ink-dark">{grade.name}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1.5 items-center">
          {grade.sections?.map((sec, i) => (
            <span key={i} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {sec}
            </span>
          ))}
        </div>
      </td>
      <td className="py-3 px-4 text-ink dark:text-ink-dark font-medium">
        {grade.class_teacher?.name || '—'}
      </td>
      <td className="py-3 px-4 text-center">
        <button
          type="button"
          onClick={() => onToggleStatus(grade)}
          className={`w-10 h-5.5 rounded-full transition-colors relative p-0.5 inline-flex items-center ${grade.status === 'Active' ? 'bg-primary' : 'bg-bad'}`}
        >
          <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${grade.status === 'Active' ? 'translate-x-4.5' : 'translate-x-0'}`} />
        </button>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button type="button" onClick={() => onView(grade)} className="p-1.5 rounded-lg border border-purple-100 dark:border-purple-900/30 bg-purple-50 dark:bg-purple-950/30 text-primary hover:bg-purple-100">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => onEdit(grade)} className="p-1.5 rounded-lg border border-purple-100 dark:border-purple-900/30 bg-purple-50 dark:bg-purple-950/30 text-primary hover:bg-purple-100">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => onDelete(grade)} className="p-1.5 rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-950/30 text-bad hover:bg-red-100">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default GradeTableRow;
