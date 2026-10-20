const AdmissionParticularsTable = ({ student }) => {
  const acad = student?.academic_history || {};

  return (
    <div className="py-2.5 border-b border-line dark:border-white/10 space-y-1.5">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-primary dark:text-primary-dark">
        Academic Background & Medical Record
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-surface-secondary/20 dark:bg-[#121217] p-2.5 rounded-xl border border-line/60 dark:border-white/10">
        <div>
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Blood Group</span>
          <p className="font-bold text-ink dark:text-ink-dark">{student?.blood_group || '—'}</p>
        </div>
        <div>
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Previous School</span>
          <p className="font-semibold text-ink dark:text-ink-dark truncate">{acad.last_institute || acad.previous_school || '—'}</p>
        </div>
        <div>
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Last Class Passed</span>
          <p className="font-semibold text-ink dark:text-ink-dark">{acad.last_class || '—'}</p>
        </div>
        <div>
          <span className="block text-[9.5px] uppercase font-bold text-ink-muted">Academic Session</span>
          <p className="font-semibold font-mono text-ink dark:text-ink-dark">{student?.academic_session || '2026-2027'}</p>
        </div>
      </div>
    </div>
  );
};

export default AdmissionParticularsTable;
