import { Users, Shield, Radio } from 'lucide-react';

const TABS = [
  { id: 'users', label: 'Users Management', icon: Users },
  { id: 'roles', label: 'User Roles', icon: Shield },
  { id: 'sessions', label: 'Session Management', icon: Radio }
];

const UserMgmtHeader = ({ activeTab, onSelectTab }) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-ink dark:text-ink-dark tracking-tight">
          User Management
        </h1>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
          Manage system users, multi-campus roles, permission matrices, and live active sessions.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-line dark:border-line-dark">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                isActive
                  ? 'border-primary text-primary dark:text-primary-dark'
                  : 'border-transparent text-ink-muted hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserMgmtHeader;
