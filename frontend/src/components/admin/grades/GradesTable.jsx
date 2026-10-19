import { useState } from 'react';
import GradeTableRow from './GradeTableRow';

const GradesTable = ({ grades = [], onEdit, onView, onDelete, onToggleStatus, onReorder }) => {
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  if (grades.length === 0) {
    return (
      <div className="py-16 text-center text-ink-muted">
        <p className="text-sm font-medium">No grades found.</p>
        <p className="text-xs mt-1">Click &ldquo;+ Add Grade&rdquo; to create your first grade and assign sections.</p>
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-line dark:border-line-dark text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            <th className="py-3.5 px-4">Grade Name</th>
            <th className="py-3.5 px-4">Sections</th>
            <th className="py-3.5 px-4">Class Teacher</th>
            <th className="py-3.5 px-4 text-center">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60 dark:divide-line-dark/60 text-xs">
          {grades.map((grade, index) => (
            <GradeTableRow
              key={grade._id}
              grade={grade}
              index={index}
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
