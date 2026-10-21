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
            <th className="py-3 px-3.5">Candidate</th>
            <th className="py-3 px-3">Position &amp; Department</th>
            <th className="py-3 px-3">Qualification &amp; Experience</th>
            <th className="py-3 px-3">Applied Date</th>
            <th className="py-3 px-3">Salary (Exp / Appr)</th>
            <th className="py-3 px-3">Resume / CV</th>
            <th className="py-3 px-3">Hiring Status</th>
            <th className="py-3 px-3.5 text-right">Quick Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60 dark:divide-white/5">
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
