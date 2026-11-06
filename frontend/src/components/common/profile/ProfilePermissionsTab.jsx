import { ShieldCheck } from 'lucide-react';
import GlobalComingSoon from '../GlobalComingSoon';

const ProfilePermissionsTab = () => {
  return (
    <div className="w-full">
      <GlobalComingSoon
        title="Permissions & Classes Studio"
        subtitle="Granular RBAC, Delegated Access & Academic Workspaces"
        description="This section is currently under development. Granular module rights, class allocation matrices, and administrative security delegations will be configurable here shortly."
        icon={ShieldCheck}
        badge="Coming Soon"
      />
    </div>
  );
};

export default ProfilePermissionsTab;
