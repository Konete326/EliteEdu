import StudentParentsIdentityCard from '../cards/StudentParentsIdentityCard';
import StudentFamilyMembersCard from '../cards/StudentFamilyMembersCard';

const StudentFamilyTab = ({ formData, onNestedChange, onChange, onRefreshFamilyNumber }) => {
  return (
    <div className="space-y-6">
      <StudentParentsIdentityCard
        formData={formData}
        onNestedChange={onNestedChange}
        onChange={onChange}
        onRefreshFamilyNumber={onRefreshFamilyNumber}
      />
      <StudentFamilyMembersCard
        familyMembers={formData.family_members}
        onChange={onChange}
      />
    </div>
  );
};

export default StudentFamilyTab;
