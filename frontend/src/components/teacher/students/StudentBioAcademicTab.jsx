import StudentBioAcademicFieldsA from './StudentBioAcademicFieldsA';
import StudentBioAcademicFieldsB from './StudentBioAcademicFieldsB';

const StudentBioAcademicTab = ({ data = {}, onChange, grades = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
      <StudentBioAcademicFieldsA data={data} onChange={onChange} grades={grades} />
      <StudentBioAcademicFieldsB data={data} onChange={onChange} />
    </div>
  );
};

export default StudentBioAcademicTab;
