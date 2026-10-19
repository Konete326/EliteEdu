import { useNavigate } from 'react-router-dom';
import { Eye, Plus } from 'lucide-react';

const MODULES = [
  { name: 'My Students Roster', path: '/teacher/students', addPath: '/teacher/students', role: 'all' },
  { name: 'Student Attendance Register', path: '/teacher/attendance', addPath: '/teacher/attendance', role: 'all' },
  { name: 'Class Tests & Continuous Assessment', path: '/teacher/class-tests', addPath: '/teacher/class-tests', role: 'all' },
  { name: 'Timetable & Class Schedule', path: '/teacher/timetable', addPath: '/teacher/timetable', role: 'all' },
  { name: 'Faculty Staff Chat & Circulars', path: '/teacher/chat', addPath: '/teacher/chat', role: 'all' },
  { name: 'Staff Attendance Report', path: '/admin/attendance/report', addPath: '/admin/attendance', role: 'Admin' },
  { name: 'Fee Collection & Challan Studio', path: '/admin/fees', addPath: '/admin/fees/generate', role: 'Admin' }
];

const ProfileAuthorizedModulesCard = ({ userRole = 'Staff' }) => {
  const navigate = useNavigate();
  const visibleModules = MODULES.filter((m) => m.role === 'all' || m.role === userRole);

  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-6 shadow-xs space-y-4">
      <div>
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Authorized ERP Modules</h3>
        <p className="text-[11px] text-ink-muted">Active capabilities with direct 1-click workspace navigation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visibleModules.map((mod) => (
          <div
            key={mod.name}
            className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/30 dark:bg-[#141419] flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
          >
            <span className="font-bold text-xs text-ink dark:text-ink-dark truncate">{mod.name}</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => navigate(mod.path)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>View</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(mod.addPath || mod.path)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileAuthorizedModulesCard;
