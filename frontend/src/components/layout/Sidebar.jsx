import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  CalendarCheck,
  DollarSign,
  CalendarDays,
  X,
  School
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user } = useAuth();

  const getNavItems = () => {
    if (!user) return [];

    if (user.role === 'SuperAdmin') {
      return [
        { name: 'Dashboard', path: '/superadmin', icon: LayoutDashboard },
        { name: 'Schools', path: '/superadmin/schools', icon: Building2 }
      ];
    }

    if (user.role === 'Admin') {
      const items = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Teachers', path: '/admin/teachers', icon: Users },
        { name: 'Students', path: '/admin/students', icon: GraduationCap },
        { name: 'Attendance', path: '/admin/attendance', icon: CalendarCheck }
      ];

      if (user.school_type === 'Private') {
        items.push({ name: 'Fees & Invoices', path: '/admin/fees', icon: DollarSign });
      }

      items.push({ name: 'Timetable', path: '/admin/timetable', icon: CalendarDays });
      return items;
    }

    if (user.role === 'Teacher') {
      return [
        { name: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
        { name: 'Attendance', path: '/teacher/attendance', icon: CalendarCheck },
        { name: 'Timetable', path: '/teacher/timetable', icon: CalendarDays }
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  const content = (
    <div className="flex flex-col h-full bg-surface dark:bg-surface-dark border-r border-line dark:border-line-dark w-64">
      <div className="flex items-center justify-between h-16 px-6 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
            <School className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-ink dark:text-ink-dark">EliteEdu</span>
        </div>
        {mobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-ink-muted hover:text-ink"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path.split('/').length === 2}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-soft text-primary dark:bg-primary/20 dark:text-primary-dark'
                    : 'text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex shrink-0">{content}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex">{content}</div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
