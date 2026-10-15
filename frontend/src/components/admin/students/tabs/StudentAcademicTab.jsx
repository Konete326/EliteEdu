import StudentAcademicHistoryCard from '../cards/StudentAcademicHistoryCard';
import StudentAdmissionTestCard from '../cards/StudentAdmissionTestCard';
import StudentAdmissionInterviewCard from '../cards/StudentAdmissionInterviewCard';

const StudentAcademicTab = ({ formData, onNestedChange }) => {
  return (
    <div className="space-y-6">
      <StudentAcademicHistoryCard
        academic={formData.academic_history}
        onNestedChange={onNestedChange}
      />
      <StudentAdmissionTestCard
        test={formData.admission_test}
        onNestedChange={onNestedChange}
      />
      <StudentAdmissionInterviewCard
        interview={formData.admission_interview}
        onNestedChange={onNestedChange}
      />
    </div>
  );
};

export default StudentAcademicTab;
