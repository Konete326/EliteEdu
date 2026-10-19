import StudentFilterInputs from './StudentFilterInputs';
import ExamFilterInputs from './ExamFilterInputs';
import AttendanceFilterInputs from './AttendanceFilterInputs';
import StaffFilterInputs from './StaffFilterInputs';
import FinanceFilterInputs from './FinanceFilterInputs';
import CertificatesFilterInputs from './CertificatesFilterInputs';

const MasterReportFilterInputs = ({
  category = 'student',
  subReport = '',
  filters = {},
  onFilterChange,
  grades = [],
  exams = []
}) => {
  if (category === 'exams') {
    return (
      <ExamFilterInputs
        filters={filters}
        onFilterChange={onFilterChange}
        grades={grades}
        exams={exams}
        subReport={subReport}
      />
    );
  }

  if (category === 'attendance') {
    return (
      <AttendanceFilterInputs
        filters={filters}
        onFilterChange={onFilterChange}
        grades={grades}
        isStaff={false}
      />
    );
  }

  if (category === 'staff_attendance') {
    return (
      <AttendanceFilterInputs
        filters={filters}
        onFilterChange={onFilterChange}
        grades={grades}
        isStaff={true}
      />
    );
  }

  if (category === 'staff_hr') {
    return (
      <StaffFilterInputs
        filters={filters}
        onFilterChange={onFilterChange}
        grades={grades}
        isFinance={false}
      />
    );
  }

  if (['fee_collection', 'outstanding_dues', 'accounts_financial', 'fee_finance'].includes(category)) {
    return (
      <FinanceFilterInputs
        filters={filters}
        onFilterChange={onFilterChange}
        grades={grades}
      />
    );
  }

  if (category === 'certificates_docs') {
    return (
      <CertificatesFilterInputs
        filters={filters}
        onFilterChange={onFilterChange}
      />
    );
  }

  return (
    <StudentFilterInputs
      filters={filters}
      onFilterChange={onFilterChange}
      grades={grades}
    />
  );
};

export default MasterReportFilterInputs;
