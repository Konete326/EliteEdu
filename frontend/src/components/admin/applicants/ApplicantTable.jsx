import ApplicantTableRow from './ApplicantTableRow';

const ApplicantTable = ({
  applicants = [],
  onStatusChange,
  onOpenConvert,
  onOpenSalary,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-line dark:border-white/10 text-[11px] font-bold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider bg-surface-secondary/20 dark:bg-white/[0.01]">
            <th className="py-3 px-3">Name</th>
            <th className="py-3 px-3">Department</th>
            <th className="py-3 px-3">Designation</th>
            <th className="py-3 px-3">Applied On</th>
            <th className="py-3 px-3">Availability</th>
            <th className="py-3 px-3">Replacement Staff</th>
            <th className="py-3 px-3">Expected Salary</th>
            <th className="py-3 px-3">Approved Salary</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((app) => (
            <ApplicantTableRow
              key={app._id}
              applicant={app}
              onStatusChange={onStatusChange}
              onOpenConvert={onOpenConvert}
              onOpenSalary={onOpenSalary}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantTable;
