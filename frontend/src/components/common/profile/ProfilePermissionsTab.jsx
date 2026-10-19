import { useState } from 'react';
import ProfileAssignedClassesCard from './ProfileAssignedClassesCard';
import ProfileAuthorizedModulesCard from './ProfileAuthorizedModulesCard';
import ProfileDangerZoneCard from './ProfileDangerZoneCard';
import ResetSchoolDataModal from './ResetSchoolDataModal';

const ProfilePermissionsTab = ({ profile }) => {
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const grades = profile?.grades || [];
  const classAssignments = profile?.class_assignments || [];
  const userRole = profile?.role || 'Staff';
  const schoolName = profile?.school_id?.name || profile?.schoolName || 'Your School';
  const isAdmin = userRole === 'Admin' || userRole === 'SuperAdmin';

  return (
    <div className="space-y-6">
      <ProfileAssignedClassesCard grades={grades} classAssignments={classAssignments} />
      <ProfileAuthorizedModulesCard userRole={userRole} />

      {isAdmin && (
        <>
          <ProfileDangerZoneCard
            onOpenModal={() => setResetModalOpen(true)}
            schoolName={schoolName}
          />
          <ResetSchoolDataModal
            isOpen={resetModalOpen}
            onClose={() => setResetModalOpen(false)}
            schoolName={schoolName}
          />
        </>
      )}
    </div>
  );
};

export default ProfilePermissionsTab;
