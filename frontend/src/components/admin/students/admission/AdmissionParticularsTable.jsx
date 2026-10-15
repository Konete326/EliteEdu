const AdmissionParticularsTable = ({ student }) => {
  const acad = student?.academic_history || {};

  return (
    <div className="py-3 border-b border-line dark:border-white/10 space-y-3">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-dark mb-2">
          Health & Personal Particulars
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-surface-secondary/20 dark:bg-[#121217] p-3 rounded-xl border border-line/60 dark:border-white/10">
          <div>
            <span className="block text-[10px] uppercase font-bold text-ink-muted">Identification Mark</span>
            <p className="font-semibold text-ink dark:text-ink-dark">{student?.identification_mark || 'Nil'}</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-ink-muted">Blood Group</span>
            <p className="font-bold text-ink dark:text-ink-dark">{student?.blood_group || '—'}</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-ink-muted">Disease If Any?</span>
            <p className="font-semibold text-ink dark:text-ink-dark">{student?.disease_if_any || 'None'}</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-ink-muted">Caste / Community</span>
            <p className="font-semibold text-ink dark:text-ink-dark">{student?.caste || '—'}</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-ink-muted">Orphan Student</span>
            <p className="font-semibold text-ink dark:text-ink-dark">{student?.is_orphan || 'No'}</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-ink-muted">Out of School (OSC)</span>
            <p className="font-semibold text-ink dark:text-ink-dark">{student?.is_osc || 'No'}</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-ink-muted">Total Siblings</span>
            <p className="font-semibold font-mono text-ink dark:text-ink-dark">{student?.total_siblings ?? 0}</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-ink-muted">Emergency Phone</span>
            <p className="font-semibold font-mono text-ink dark:text-ink-dark">{student?.emergency_contact_no || '—'}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-dark mb-2">
          Previous Academic History
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-surface-secondary/20 dark:bg-[#121217] p-3 rounded-xl border border-line/60 dark:border-white/10">
          <div>
            <span className="block text-[10px] uppercase font-bold text-ink-muted">Previous School</span>
            <p className="font-semibold text-ink dark:text-ink-dark">{acad.last_institute || acad.previous_school || '—'}</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-ink-muted">Board Roll / ID No</span>
            <p className="font-semibold font-mono text-ink dark:text-ink-dark">{acad.previous_id_roll_no || '—'}</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-ink-muted">Last Class Passed</span>
            <p className="font-semibold text-ink dark:text-ink-dark">{acad.last_class || '—'}</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-ink-muted">Additional Remarks</span>
            <p className="font-semibold text-ink dark:text-ink-dark truncate">{student?.additional_notes || acad.last_result || 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionParticularsTable;
