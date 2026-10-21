import { useState } from 'react';
import { Layers } from 'lucide-react';
import GradeTableRow from './GradeTableRow';

const GradesTable = ({
  grades = [],
  onEdit,
  onView,
  onDelete,
  onToggleStatus,
  onReorder
}) => {
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  if (grades.length === 0) {
    return (
      <div className="py-14 text-center text-ink-muted space-y-2">
        <Layers className="w-8 h-8 mx-auto text-ink-muted" />
        <p className="text-sm font-bold text-ink dark:text-white">No academic grades found</p>
        <p className="text-xs">Click &quot;Add Grade&quot; or &quot;Auto-Load Standard&quot; to configure classes.</p>
      </div>
    );
  }

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== index) setDragOverIdx(index);
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }
    const updated = [...grades];
    const [moved] = updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, moved);
    setDraggedIdx(null);
    setDragOverIdx(null);
    if (onReorder) onReorder(updated);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleMoveUp = (index) => {
    if (index <= 0) return;
    const updated = [...grades];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    if (onReorder) onReorder(updated);
  };

  const handleMoveDown = (index) => {
    if (index >= grades.length - 1) return;
    const updated = [...grades];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    if (onReorder) onReorder(updated);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border-b border-line dark:border-line-dark text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            <th className="py-3 px-3.5">Sequence & Class</th>
            <th className="py-3 px-3.5">Active Sections</th>
            <th className="py-3 px-3.5">Class Teacher</th>
            <th className="py-3 px-3.5">Campus Branch</th>
            <th className="py-3 px-3.5 text-center">Status</th>
            <th className="py-3 px-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line dark:divide-line-dark text-xs">
          {grades.map((grade, index) => (
            <GradeTableRow
              key={grade._id}
              grade={grade}
              index={index}
              isFirst={index === 0}
              isLast={index === grades.length - 1}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              isDragged={draggedIdx === index}
              isDragOver={dragOverIdx === index}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              canReorder={Boolean(onReorder)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradesTable;
