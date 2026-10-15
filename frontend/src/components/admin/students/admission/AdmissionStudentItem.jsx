const AdmissionStudentItem = ({ student, isSelected, onSelect }) => {
  const initials = student.name ? student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'ST';

  return (
    <div
      onClick={() => onSelect(student)}
      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
        isSelected
          ? 'border-primary bg-primary/10 dark:bg-primary/20 shadow-xs'
          : 'border-line/60 dark:border-line-dark bg-surface-secondary/20 dark:bg-[#121217] hover:bg-surface-secondary/60'
      }`}
    >
      <div className="w-9 h-9 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
        {student.photo_url ? (
          <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
        ) : initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs font-bold text-ink dark:text-ink-dark truncate">{student.name}</p>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface border border-line dark:border-white/5 text-ink-muted shrink-0">
            GR: {student.gr_number}
          </span>
        </div>
        <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark truncate">
          {student.father_name || '—'} • {student.current_grade?.name || 'Class'} ({student.current_section || 'A'})
        </p>
      </div>
    </div>
  );
};

export default AdmissionStudentItem;
