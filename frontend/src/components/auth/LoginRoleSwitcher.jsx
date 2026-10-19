import { Shield, GraduationCap, User } from 'lucide-react';

const ROLES = [
  { id: 'Admin', label: 'Admin', icon: Shield },
  { id: 'Teacher', label: 'Teacher / Staff', icon: GraduationCap },
  { id: 'Student', label: 'Student / Parent', icon: User }
];

const LoginRoleSwitcher = ({ activeRole, onSelectRole }) => (
  <div className="flex items-center justify-between p-1 bg-surface-secondary/70 dark:bg-surface-secondary-dark rounded-xl border border-line dark:border-line-dark mb-6">
    {ROLES.map((r) => {
      const Icon = r.icon;
      const isActive = activeRole === r.id;
      return (
        <button
          key={r.id}
          type="button"
          onClick={() => onSelectRole(r.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
            isActive
              ? 'bg-primary text-white shadow-sm shadow-primary/25'
              : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
          }`}
        >
          <Icon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{r.label}</span>
        </button>
      );
    })}
  </div>
);

export default LoginRoleSwitcher;
