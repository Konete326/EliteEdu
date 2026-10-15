import { Link } from 'react-router-dom';
import { CalendarCheck, BookOpen, Award, Calendar, DollarSign, UserCheck, Video } from 'lucide-react';

const TeacherPermittedActions = ({ permissions = {} }) => {
  const actions = [
    { key: 'attendance', label: 'Mark Attendance', path: '/teacher/attendance', icon: CalendarCheck, color: 'hover:border-primary text-primary' },
    { key: 'homework', label: 'Assign Homework', path: '/teacher/homework', icon: BookOpen, color: 'hover:border-indigo-500 text-indigo-500' },
    { key: 'examination', label: 'Exams & Marks', path: '/teacher/examination', icon: Award, color: 'hover:border-amber-500 text-amber-500' },
    { key: 'timetable', label: 'Class Timetable', path: '/teacher/timetable', icon: Calendar, color: 'hover:border-emerald-500 text-emerald-500' },
    { key: 'online_classes', label: 'Online Lectures', path: '/teacher/online-classes', icon: Video, color: 'hover:border-cyan-500 text-cyan-500' },
    { key: 'salary', label: 'Salary Slip', path: '/teacher/salary', icon: DollarSign, color: 'hover:border-teal-500 text-teal-500' },
    { key: 'my_profile', label: 'My Profile', path: '/teacher/profile', icon: UserCheck, color: 'hover:border-purple-500 text-purple-500' }
  ];

  const permittedActions = actions.filter((a) => permissions[a.key] !== false);

  if (permittedActions.length === 0) return null;

  return (
    <div className="rounded-3xl bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark p-5 shadow-xs space-y-3">
      <h3 className="font-bold text-sm text-ink dark:text-ink-dark">Quick Permitted Modules</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {permittedActions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.key}
              to={act.path}
              className={`p-3 rounded-2xl bg-surface-secondary/40 dark:bg-[#141418] border border-line dark:border-line-dark flex flex-col items-center justify-center text-center gap-2 transition-all hover:shadow-xs group ${act.color}`}
            >
              <div className="w-9 h-9 rounded-xl bg-surface dark:bg-[#1a1a22] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-ink dark:text-ink-dark">{act.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherPermittedActions;
