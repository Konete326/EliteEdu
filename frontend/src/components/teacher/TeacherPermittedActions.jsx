import { Link } from 'react-router-dom';
import {
  CalendarCheck, BookOpen, Award, Calendar, DollarSign, UserCheck,
  Video, FileText, Users, CreditCard, AlertCircle
} from 'lucide-react';

const TeacherPermittedActions = ({ permissions = {}, customRole = null }) => {
  const rolePerms = customRole?.permissions || [];
  const hasCustom = Array.isArray(rolePerms) && rolePerms.length > 0;

  let permittedActions = [];

  if (hasCustom) {
    const allowed = new Set(rolePerms.filter((p) => p.view).map((p) => p.module_key?.toLowerCase()));

    if (allowed.has('fees')) {
      permittedActions.push({
        key: 'fee_collection',
        label: 'Collect Fees',
        path: '/admin/fees/collection',
        icon: DollarSign,
        color: 'hover:border-good text-good'
      });
      permittedActions.push({
        key: 'fee_defaulters',
        label: 'Fee Defaulters',
        path: '/admin/fees/defaulters',
        icon: AlertCircle,
        color: 'hover:border-bad text-bad'
      });
    }

    if (allowed.has('admission_letter')) {
      permittedActions.push({
        key: 'admission_letter',
        label: 'Admission Letter',
        path: '/admin/students/admission-letter',
        icon: FileText,
        color: 'hover:border-primary text-primary'
      });
    }

    if (allowed.has('students')) {
      permittedActions.push({
        key: 'students',
        label: 'Student Directory',
        path: '/admin/students',
        icon: Users,
        color: 'hover:border-primary text-primary'
      });
    }

    if (allowed.has('student_id_cards')) {
      permittedActions.push({
        key: 'student_id_cards',
        label: 'Student ID Cards',
        path: '/admin/students/id-cards',
        icon: CreditCard,
        color: 'hover:border-indigo-500 text-indigo-500'
      });
    }

    if (allowed.has('attendance')) {
      permittedActions.push({
        key: 'attendance',
        label: 'Mark Attendance',
        path: '/admin/attendance/students',
        icon: CalendarCheck,
        color: 'hover:border-primary text-primary'
      });
    }

    if (allowed.has('exams')) {
      permittedActions.push({
        key: 'examination',
        label: 'Examinations',
        path: '/admin/exam-management/exams',
        icon: Award,
        color: 'hover:border-amber-500 text-amber-500'
      });
    }

    permittedActions.push({
      key: 'my_profile',
      label: 'My Profile',
      path: '/teacher/profile',
      icon: UserCheck,
      color: 'hover:border-purple-500 text-purple-500'
    });
  } else {
    const actions = [
      { key: 'attendance', label: 'Mark Attendance', path: '/teacher/attendance', icon: CalendarCheck, color: 'hover:border-primary text-primary' },
      { key: 'homework', label: 'Assign Homework', path: '/teacher/homework', icon: BookOpen, color: 'hover:border-indigo-500 text-indigo-500' },
      { key: 'examination', label: 'Exams & Marks', path: '/teacher/exams', icon: Award, color: 'hover:border-amber-500 text-amber-500' },
      { key: 'timetable', label: 'Class Timetable', path: '/teacher/timetable', icon: Calendar, color: 'hover:border-emerald-500 text-emerald-500' },
      { key: 'online_classes', label: 'Online Lectures', path: '/teacher/online-classes', icon: Video, color: 'hover:border-cyan-500 text-cyan-500' },
      { key: 'salary', label: 'Salary Slip', path: '/teacher/salary', icon: DollarSign, color: 'hover:border-teal-500 text-teal-500' },
      { key: 'my_profile', label: 'My Profile', path: '/teacher/profile', icon: UserCheck, color: 'hover:border-purple-500 text-purple-500' }
    ];
    permittedActions = actions.filter((a) => permissions[a.key] !== false);
  }

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
              <span className="text-[11px] font-bold text-ink dark:text-ink-dark">{act.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherPermittedActions;
