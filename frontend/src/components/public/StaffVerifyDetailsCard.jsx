const StaffVerifyDetailsCard = ({ data }) => {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
      <div className="p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-white/[0.02] border border-line dark:border-line-dark">
        <p className="text-[10px] font-bold text-ink-muted">Place of Posting</p>
        <p className="font-bold text-ink dark:text-ink-dark mt-0.5 truncate">{data.institution?.campus_name}</p>
      </div>
      <div className="p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-white/[0.02] border border-line dark:border-line-dark">
        <p className="text-[10px] font-bold text-ink-muted">SEMIS Code</p>
        <p className="font-mono font-bold text-ink dark:text-ink-dark mt-0.5">{data.semis_code || '408110114'}</p>
      </div>
      <div className="p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-white/[0.02] border border-line dark:border-line-dark">
        <p className="text-[10px] font-bold text-ink-muted">Blood Group</p>
        <p className="font-bold text-red-600 mt-0.5">{data.blood_group || 'O+'}</p>
      </div>
      <div className="p-2.5 rounded-xl bg-surface-secondary/40 dark:bg-white/[0.02] border border-line dark:border-line-dark">
        <p className="text-[10px] font-bold text-ink-muted">Service Status</p>
        <p className="font-bold text-good mt-0.5">{data.status || 'Active'}</p>
      </div>
    </div>
  );
};

export default StaffVerifyDetailsCard;
