const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const StudentIdentityTab = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            B-Form / CNIC Number
          </label>
          <input
            type="text"
            value={data.b_form || ''}
            onChange={(e) => onChange('b_form', e.target.value)}
            placeholder="e.g. 42101-1234567-1"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Blood Group
          </label>
          <select
            value={data.blood_group || ''}
            onChange={(e) => onChange('blood_group', e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          >
            <option value="">Select Blood Group</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            Religion
          </label>
          <input
            type="text"
            value={data.religion || 'Islam'}
            onChange={(e) => onChange('religion', e.target.value)}
            placeholder="e.g. Islam"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
          Medical Conditions / Disease / Allergies
        </label>
        <textarea
          rows={2}
          value={data.disease_if_any || ''}
          onChange={(e) => onChange('disease_if_any', e.target.value)}
          placeholder="Mention any known health conditions, allergies, or medication instructions..."
          className="w-full px-3 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary resize-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
          Faculty Behavioral & Academic Notes
        </label>
        <textarea
          rows={2}
          value={data.additional_notes || ''}
          onChange={(e) => onChange('additional_notes', e.target.value)}
          placeholder="Class teacher observations regarding learning curve, discipline, or special achievements..."
          className="w-full px-3 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary resize-none"
        />
      </div>
    </div>
  );
};

export default StudentIdentityTab;
