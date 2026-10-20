import { Shield, GraduationCap, User } from 'lucide-react';

const ROLES = [
  { id: 'Admin', primary: 'Admin', suffix: '', icon: Shield },
  { id: 'Teacher', primary: 'Teacher', suffix: ' / Staff', icon: GraduationCap },
  { id: 'Student', primary: 'Student', suffix: ' / Parent', icon: User }
];

const LoginRoleSwitcher = ({ activeRole, onSelectRole }) => (
  <div className="flex items-center justify-between p-1 bg-surface-secondary/70 dark:bg-surface-secondary-dark rounded-xl border border-line dark:border-line-dark mb-5 w-full">
    {ROLES.map((r) => {
      const Icon = r.icon;
      const isActive = activeRole === r.id;
      return (
        <button
          key={r.id}
          type="button"
          onClick={() => onSelectRole(r.id)}
          className={`flex-1 flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-lg text-xs font-bold transition-all touch-manipulation cursor-pointer ${
            isActive
              ? 'bg-primary text-white shadow-sm shadow-primary/25 font-extrabold'
              : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark font-medium'
          }`}
        >
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate text-center">
            {r.primary}
            {r.suffix && <span className="hidden sm:inline">{r.suffix}</span>}
          </span>
        </button>
      );
    })}
  </div>
);

export default LoginRoleSwitcher;
