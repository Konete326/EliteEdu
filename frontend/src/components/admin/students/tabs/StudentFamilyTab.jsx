import StudentParentsIdentityCard from '../cards/StudentParentsIdentityCard';
import StudentFamilyMembersCard from '../cards/StudentFamilyMembersCard';

const StudentFamilyTab = ({ formData, onNestedChange, onChange }) => {
  return (
    <div className="space-y-6">
      <StudentParentsIdentityCard
        formData={formData}
        onNestedChange={onNestedChange}
        onChange={onChange}
      />
      <StudentFamilyMembersCard
        familyMembers={formData.family_members}
        onChange={onChange}
      />
    </div>
  );
};

export default StudentFamilyTab;
