import { Users, Shield, Radio } from 'lucide-react';
import MobileTabStepper from '../../common/MobileTabStepper';

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
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-3 sm:space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
          <Users className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h1 className="text-base sm:text-xl font-black text-ink dark:text-ink-dark tracking-tight">
            {title}
          </h1>
          <p className="hidden sm:block text-xs font-semibold text-ink-muted mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <MobileTabStepper
        tabs={TABS}
        activeTab={activeTab}
        onChange={onSelectTab}
      />
    </div>
  );
};

export default UserMgmtHeader;
