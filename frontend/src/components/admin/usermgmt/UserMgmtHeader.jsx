import { Users, Shield, Radio } from 'lucide-react';

const TABS = [
  { id: 'users', label: 'Users Management', icon: Users },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'sessions', label: 'Session Management', icon: Radio }
];

const UserMgmtHeader = ({ activeTab, onSelectTab }) => {
  const isRoles = activeTab === 'roles';
  const isSessions = activeTab === 'sessions';
  const title = isRoles ? 'Roles & Permissions' : isSessions ? 'Session Management' : 'User Management';
  const subtitle = isRoles
    ? 'Define institutional roles, assign dashboard templates, and configure granular permission matrices'
    : isSessions
    ? 'Monitor live concurrent user sessions, device footprints, and manage IP restrictions'
    : 'Manage system users, multi-campus roles, permission matrices, and live active sessions';

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">
            {title}
          </h1>
          <p className="text-xs font-semibold text-ink-muted mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-surface-secondary/40 border border-line text-ink-muted hover:text-ink'
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
