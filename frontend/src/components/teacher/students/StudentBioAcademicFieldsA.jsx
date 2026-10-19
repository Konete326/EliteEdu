const StudentBioAcademicFieldsA = ({ data = {}, onChange, grades = [] }) => {
  return (
    <>
      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          Student Name <span className="text-bad">*</span>
        </label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Full name"
          required
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">GR / Admission #</label>
        <input
          type="text"
          value={data.gr_number || ''}
          onChange={(e) => onChange('gr_number', e.target.value)}
          placeholder="e.g. 1024"
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink font-mono outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Roll Number</label>
        <input
          type="text"
          value={data.roll_no || ''}
          onChange={(e) => onChange('roll_no', e.target.value)}
          placeholder="e.g. 12"
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Class / Grade</label>
        <select
          value={data.current_grade?._id || data.current_grade || ''}
          onChange={(e) => onChange('current_grade', e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary font-medium"
        >
          {grades.map((g) => (
            <option key={g._id} value={g._id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Section</label>
        <input
          type="text"
          value={data.current_section || 'A'}
          onChange={(e) => onChange('current_section', e.target.value.toUpperCase())}
          placeholder="A, B, C..."
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary font-bold"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Date of Birth</label>
        <input
          type="date"
          value={data.dob ? String(data.dob).slice(0, 10) : ''}
          onChange={(e) => onChange('dob', e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        />
      </div>
    </>
  );
};

export default StudentBioAcademicFieldsA;
