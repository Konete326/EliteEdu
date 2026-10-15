import StudentBasicIdentityCard from '../cards/StudentBasicIdentityCard';
import StudentPlacementCard from '../cards/StudentPlacementCard';
import StudentEnrollmentStatusCard from '../cards/StudentEnrollmentStatusCard';
import StudentFeeDiscountCard from '../cards/StudentFeeDiscountCard';

const StudentProfileTab = ({ formData, errors = {}, campuses, grades, onChange }) => {
  return (
    <div className="space-y-6">
      <StudentBasicIdentityCard formData={formData} errors={errors} onChange={onChange} />
      <StudentPlacementCard formData={formData} errors={errors} campuses={campuses} grades={grades} onChange={onChange} />
      <StudentEnrollmentStatusCard formData={formData} onChange={onChange} />
      <StudentFeeDiscountCard formData={formData} onChange={onChange} />
    </div>
  );
};

export default StudentProfileTab;
