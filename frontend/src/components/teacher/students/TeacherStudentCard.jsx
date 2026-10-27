import { Pencil, Eye, Phone, GraduationCap, Hash } from 'lucide-react';

const TeacherStudentCard = ({ student, onEdit, onView }) => {
  const photo = student.photo_url;
  const initial = student.name ? student.name[0].toUpperCase() : 'S';
  const gradeName = student.current_grade?.name || 'Class';
  const section = student.current_section || 'A';
  const contact = student.contact_number || student.emergency_contact_no || student.father_details?.mobile || 'No contact';
  const rollNo = student.roll_no;
  const status = student.status || 'Active';
  const isStatusActive = status === 'Active';

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    onView?.(student);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark p-4 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-black flex items-center justify-center text-base overflow-hidden border border-primary/20 shrink-0">
              {photo ? (
                <img src={photo} alt={student.name} className="w-full h-full object-cover" />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-surface dark:border-surface-dark ${
                isStatusActive ? 'bg-good' : 'bg-warn'
              }`}
              title={status}
            />
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-0.5 rounded-lg font-mono font-bold text-[11px] bg-surface-secondary text-ink dark:text-ink-dark border border-line/60">
              GR #{student.gr_number || '—'}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isStatusActive
                  ? 'bg-good/10 text-good border border-good/20'
                  : 'bg-warn/10 text-warn border border-warn/20'
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-black text-sm text-ink dark:text-ink-dark line-clamp-1 group-hover:text-primary transition-colors">
            {student.name}
          </h3>
          <p className="text-[11px] text-ink-muted line-clamp-1">
            S/O {student.father_name && student.father_name !== 'N/A' ? student.father_name : '—'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-line/60 dark:border-line-dark/60 text-xs">
          <div className="flex items-center gap-1.5 text-ink-muted">
            <GraduationCap size={13} className="text-primary shrink-0" />
            <span className="font-bold text-ink dark:text-ink-dark truncate">
              {gradeName} <span className="font-medium text-ink-muted">({section})</span>
            </span>
          </div>

          {rollNo ? (
            <div className="flex items-center gap-1.5 text-ink-muted">
              <Hash size={13} className="text-accent shrink-0" />
              <span className="font-mono text-ink dark:text-ink-dark truncate">
                Roll: {rollNo}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-ink-muted">
              <span className="text-[10px] text-ink-faint">Roll: —</span>
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-muted">
          <Phone size={12} className="shrink-0 text-ink-faint" />
          <span className="font-mono truncate">{contact}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-line/60 dark:border-line-dark/60">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(student);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
        >
          <Pencil size={13} />
          <span>Edit Profile</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onView(student);
          }}
          className="flex items-center justify-center p-1.5 px-3 rounded-xl text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors cursor-pointer"
          title="View Details"
        >
          <Eye size={13} />
          <span>View</span>
        </button>
      </div>
    </div>
  );
};

export default TeacherStudentCard;
