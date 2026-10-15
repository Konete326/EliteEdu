const AdmissionParentDetails = ({ student }) => {
  const f = student?.father_details || {};
  const m = student?.mother_details || {};
  const fName = f.name || student?.father_name || '—';
  const fCnic = f.cnic || student?.parents_cnic?.father_cnic || '—';
  const fMobile = f.mobile || student?.contact_number || '—';
  const mName = m.name || student?.mother_guardian_name || '—';
  const mCnic = m.cnic || student?.parents_cnic?.mother_cnic || '—';

  return (
    <div className="py-3 border-b border-line dark:border-white/10">
      <h3 className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-dark mb-2">
        Parent & Guardian Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/20 dark:bg-[#121217] space-y-2">
          <div className="pb-1.5 border-b border-line/60 dark:border-white/5 flex items-center justify-between">
            <span className="font-black text-ink dark:text-ink-dark uppercase text-[11px]">Father Particulars</span>
            <span className="text-[10px] font-bold text-primary dark:text-primary-dark px-1.5 py-0.2 rounded bg-primary-soft">Primary</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-3">
            <div>
              <span className="block text-[10px] uppercase font-bold text-ink-muted">Father Name</span>
              <p className="font-bold text-ink dark:text-ink-dark">{fName}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-ink-muted">National ID (CNIC)</span>
              <p className="font-mono font-bold text-ink dark:text-ink-dark">{fCnic}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-ink-muted">Education</span>
              <p className="font-semibold text-ink dark:text-ink-dark">{f.education || '—'}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-ink-muted">Mobile No</span>
              <p className="font-mono font-bold text-ink dark:text-ink-dark">{fMobile}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-ink-muted">Occupation</span>
              <p className="font-semibold text-ink dark:text-ink-dark">{f.occupation || '—'}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-ink-muted">Profession</span>
              <p className="font-semibold text-ink dark:text-ink-dark">{f.profession || '—'}</p>
            </div>
            <div className="col-span-2">
              <span className="block text-[10px] uppercase font-bold text-ink-muted">Monthly Income</span>
              <p className="font-bold font-mono text-ink dark:text-ink-dark">Rs. {(f.income || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/20 dark:bg-[#121217] space-y-2">
          <div className="pb-1.5 border-b border-line/60 dark:border-white/5 flex items-center justify-between">
            <span className="font-black text-ink dark:text-ink-dark uppercase text-[11px]">Mother Particulars</span>
            <span className="text-[10px] font-bold text-ink-muted px-1.5 py-0.2 rounded bg-surface-secondary">Parent</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-3">
            <div>
              <span className="block text-[10px] uppercase font-bold text-ink-muted">Mother Name</span>
              <p className="font-bold text-ink dark:text-ink-dark">{mName}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-ink-muted">National ID (CNIC)</span>
              <p className="font-mono font-bold text-ink dark:text-ink-dark">{mCnic}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-ink-muted">Education</span>
              <p className="font-semibold text-ink dark:text-ink-dark">{m.education || '—'}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-ink-muted">Mobile No</span>
              <p className="font-mono font-bold text-ink dark:text-ink-dark">{m.mobile || '—'}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-ink-muted">Occupation</span>
              <p className="font-semibold text-ink dark:text-ink-dark">{m.occupation || '—'}</p>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-ink-muted">Profession</span>
              <p className="font-semibold text-ink dark:text-ink-dark">{m.profession || '—'}</p>
            </div>
            <div className="col-span-2">
              <span className="block text-[10px] uppercase font-bold text-ink-muted">Monthly Income</span>
              <p className="font-bold font-mono text-ink dark:text-ink-dark">Rs. {(m.income || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionParentDetails;
