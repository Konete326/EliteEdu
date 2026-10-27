import { Link } from 'react-router-dom';
import {
  CalendarCheck, BookOpen, Award, Calendar, DollarSign, UserCheck,
  Video, Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TeacherPermittedActions = ({ permissions = {}, customRole = null }) => {
  const { user } = useAuth();
  const schoolType = user?.school_type || user?.school_id?.school_type || 'Private';
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
    { key: 'homework', label: 'Assign Homework', path: '/teacher/homework', icon: BookOpen, color: 'hover:border-indigo-500 text-indigo-500', badge: 'Coming Soon' },
    { key: 'exams', label: 'Exams & Marks', path: '/teacher/exams', icon: Award, color: 'hover:border-amber-500 text-amber-500', badge: 'Coming Soon' },
    { key: 'timetable', label: 'Class Timetable', path: '/teacher/timetable', icon: Calendar, color: 'hover:border-emerald-500 text-emerald-500' },
    { key: 'online_classes', label: 'Virtual Classrooms', path: '/teacher/online-classes', icon: Video, color: 'hover:border-cyan-500 text-cyan-500', badge: 'Coming Soon' },
    { key: 'salary', label: 'Salary Slip', path: '/teacher/salary', icon: DollarSign, color: 'hover:border-teal-500 text-teal-500', badge: 'Coming Soon' },
    { key: 'my_profile', label: 'My Profile', path: '/teacher/profile', icon: UserCheck, color: 'hover:border-primary text-primary' }
  ];

  const permittedActions = actions.filter((act) => {
    if (act.key === 'salary' && schoolType === 'Government') return false;
    if (act.key === 'exams') return hasAccess('exams') || hasAccess('examination') || Boolean(permissions.exam_management);
    if (act.key === 'students') return hasAccess('students');
    return hasAccess(act.key);
  });

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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
              <span className="text-[11px] font-bold text-ink dark:text-ink-dark flex items-center justify-center gap-1.5 flex-wrap">
                <span>{act.label}</span>
                {act.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {act.badge}
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherPermittedActions;
