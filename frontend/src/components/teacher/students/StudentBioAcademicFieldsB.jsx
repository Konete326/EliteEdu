const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const STATUSES = ['Active', 'Registered', 'Pending', 'Suspended'];

const StudentBioAcademicFieldsB = ({ data = {}, onChange }) => {
  return (
    <>
      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          Gender <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
        </label>
        <select
          value={data.gender || 'Male'}
          onChange={(e) => onChange('gender', e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        >
          {GENDERS.map((g) => (<option key={g} value={g}>{g}</option>))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          B-Form / CNIC <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={data.b_form || data.b_form_id || ''}
          onChange={(e) => { onChange('b_form', e.target.value); onChange('b_form_id', e.target.value); }}
          placeholder="e.g. 42101-1234567-1"
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          Religion <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={data.religion || 'Islam'}
          onChange={(e) => onChange('religion', e.target.value)}
          placeholder="e.g. Islam"
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          Blood Group <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
        </label>
        <select
          value={data.blood_group || ''}
          onChange={(e) => onChange('blood_group', e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        >
          <option value="">Select Blood Group</option>
          {BLOOD_GROUPS.map((bg) => (<option key={bg} value={bg}>{bg}</option>))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          Status <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
        </label>
        <select
          value={data.status || 'Active'}
          onChange={(e) => onChange('status', e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        >
          {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          Photo URL <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={data.photo_url || data.avatar_url || ''}
          onChange={(e) => { onChange('photo_url', e.target.value); onChange('avatar_url', e.target.value); }}
          placeholder="Enter image URL"
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        />
      </div>
    </>
  );
};

export default StudentBioAcademicFieldsB;
