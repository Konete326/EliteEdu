import { Link } from 'react-router-dom';
import { CalendarCheck, Calendar, UserCheck, Users } from 'lucide-react';

const TeacherPermittedActions = ({ permissions = {}, customRole = null }) => {
  const rolePerms = customRole?.permissions || [];
  const hasCustom = Array.isArray(rolePerms) && rolePerms.length > 0;

  const allowed = hasCustom
    ? new Set(rolePerms.filter((p) => p.view).map((p) => p.module_key?.toLowerCase()))
    : null;

  const hasAccess = (key) => {
    if (allowed) return allowed.has(key);
    return permissions[key] !== false;
  };

  const actions = [
    { key: 'attendance', label: 'Mark Attendance', path: '/teacher/attendance', icon: CalendarCheck, color: 'hover:border-primary text-primary' },
    { key: 'students', label: 'My Students', path: '/teacher/students', icon: Users, color: 'hover:border-emerald-500 text-emerald-500' },
    { key: 'timetable', label: 'Class Timetable', path: '/teacher/timetable', icon: Calendar, color: 'hover:border-indigo-500 text-indigo-500' },
    { key: 'my_profile', label: 'My Profile', path: '/teacher/profile', icon: UserCheck, color: 'hover:border-primary text-primary' }
  ];

  const permittedActions = actions.filter((act) => hasAccess(act.key));

  if (permittedActions.length === 0) return null;

  return (
    <div className="rounded-3xl bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-ink dark:text-ink-dark">
          {customRole ? `${customRole.name} • Permitted Actions` : 'Quick Permitted Modules'}
        </h3>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
          {permittedActions.length} Actions Available
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {permittedActions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.key}
              to={act.path}
              className={`p-3.5 rounded-2xl bg-surface-secondary/40 dark:bg-[#141418] border border-line dark:border-line-dark flex flex-col items-center justify-center text-center gap-2 transition-all hover:shadow-xs group ${act.color}`}
            >
              <div className="w-10 h-10 rounded-xl bg-surface dark:bg-[#1a1a22] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-ink dark:text-ink-dark">
                {act.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherPermittedActions;
