import { X, Layers, Users, Building, Calendar, Edit3, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GradeDetailsModal = ({ isOpen, grade, onClose, onEdit, campuses = [], teachers = [] }) => {
  const navigate = useNavigate();
  if (!isOpen || !grade) return null;

  const campusName = grade.campus_id?.name || campuses.find((c) => c._id === (grade.campus_id?._id || grade.campus_id))?.name || 'All Campuses';
  const teacher = teachers.find((t) => t._id === (grade.class_teacher?._id || grade.class_teacher)) || grade.class_teacher;
  const teacherName = teacher?.name || 'Unassigned';
  const sections = Array.isArray(grade.sections) && grade.sections.length > 0 ? grade.sections : ['A'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-4">
        <div className="flex items-start justify-between pb-4 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-ink dark:text-ink-dark">{grade.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${grade.status === 'Active' ? 'bg-good-soft text-good dark:bg-good/20' : 'bg-bad-soft text-bad dark:bg-bad/20'}`}>
                  {grade.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
                Academic Grade / Class Specification
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 space-y-1">
              <span className="text-ink-muted flex items-center gap-1 font-semibold uppercase text-[10px]">
                <Building className="w-3.5 h-3.5 text-primary" /> Campus
              </span>
              <p className="font-bold text-sm text-ink dark:text-ink-dark">{campusName}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 space-y-1">
              <span className="text-ink-muted flex items-center gap-1 font-semibold uppercase text-[10px]">
                <Users className="w-3.5 h-3.5 text-primary" /> Class Teacher
              </span>
              <p className="font-bold text-sm text-ink dark:text-ink-dark">{teacherName}</p>
              {teacher?.email && <p className="text-[11px] text-ink-muted truncate">{teacher.email}</p>}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-ink-muted font-semibold uppercase text-[10px]">Configured Sections</span>
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[10px]">
                {sections.length} {sections.length === 1 ? 'Section' : 'Sections'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sections.map((sec, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl text-xs font-bold bg-surface dark:bg-[#1f1f1f] border border-line dark:border-white/10 text-primary shadow-xs">
                  Section {sec}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-secondary/30 dark:bg-[#141414]/50 border border-line/60 dark:border-white/5 text-ink-muted text-[11px]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Created {grade.createdAt ? new Date(grade.createdAt).toLocaleDateString() : 'N/A'}
            </span>
            <button
              type="button"
              onClick={() => { onClose(); navigate(`/admin/students?gradeId=${grade._id}`); }}
              className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
            >
              <span>View Enrolled Students</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold text-ink-muted hover:bg-surface-secondary dark:hover:bg-[#1a1a1a]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => { onClose(); onEdit(grade); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Grade</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeDetailsModal;
