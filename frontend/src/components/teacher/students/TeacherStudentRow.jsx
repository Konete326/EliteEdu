import { Pencil, Eye } from 'lucide-react';

const TeacherStudentRow = ({ student, onEdit, onView }) => {
  const photo = student.photo_url;
  const initial = student.name ? student.name[0].toUpperCase() : 'S';
  const gradeName = student.current_grade?.name || 'Class';
  const section = student.current_section || 'A';
  const contact = student.contact_number || student.emergency_contact_no || student.father_details?.mobile || '—';

  return (
    <tr className="hover:bg-surface-secondary/40 transition-colors">
      <td className="p-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-xs overflow-hidden shrink-0 border border-primary/20">
            {photo ? <img src={photo} alt="" className="w-full h-full object-cover" /> : initial}
          </div>
          <div>
            <p className="font-bold text-ink dark:text-ink-dark line-clamp-1">{student.name}</p>
            <p className="text-[10px] text-ink-muted line-clamp-1">S/O {student.father_name || '—'}</p>
          </div>
        </div>
      </td>
      <td className="p-3 font-mono font-bold text-ink dark:text-ink-dark">{student.gr_number || '—'}</td>
      <td className="p-3 font-bold text-primary dark:text-primary-dark">{gradeName}</td>
      <td className="p-3">
        <span className="px-2 py-0.5 rounded-md font-bold bg-surface-secondary text-[10px] text-ink dark:text-ink-dark border border-line/40">
          Sec {section}
        </span>
      </td>
      <td className="p-3 font-mono text-xs text-ink-muted">{contact}</td>
      <td className="p-3 text-center">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-good/10 text-good border border-good/20">
          {student.status || 'Active'}
        </span>
      </td>
      <td className="p-3 text-right">
        <div className="inline-flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(student)}
            title="Edit Full Profile"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            <Pencil className="w-3 h-3" />
            <span>Edit Full Profile</span>
          </button>
          <button
            type="button"
            onClick={() => onView(student)}
            title="View Full Profile"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            <span>View</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TeacherStudentRow;
