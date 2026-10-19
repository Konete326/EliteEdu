const StudentContactAddressTab = ({ data = {}, onChange }) => {
  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Primary Contact #</label>
          <input
            type="text"
            value={data.contact_number || ''}
            onChange={(e) => onChange('contact_number', e.target.value)}
            placeholder="+923..."
            className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Emergency Contact #</label>
          <input
            type="text"
            value={data.emergency_contact_no || ''}
            onChange={(e) => onChange('emergency_contact_no', e.target.value)}
            placeholder="+923..."
            className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">City</label>
          <input
            type="text"
            value={data.city || 'Karachi'}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="e.g. Karachi"
            className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Residential Address</label>
        <input
          type="text"
          value={data.current_address || data.address || ''}
          onChange={(e) => {
            onChange('current_address', e.target.value);
            onChange('address', e.target.value);
          }}
          placeholder="House #, street, block, area..."
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Medical Notes & Allergies</label>
        <input
          type="text"
          value={data.medical_notes || data.disease_if_any || ''}
          onChange={(e) => {
            onChange('medical_notes', e.target.value);
            onChange('disease_if_any', e.target.value);
          }}
          placeholder="Any known allergy, medical history, or dietary restrictions..."
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        />
      </div>

      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
        <h4 className="font-bold text-[11px] text-primary uppercase tracking-wider">Student Portal Credentials</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Portal Username / Login ID</label>
            <input
              type="text"
              value={data.portal_username || ''}
              onChange={(e) => onChange('portal_username', e.target.value)}
              placeholder="e.g. 1024ahmed"
              className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink font-mono outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Portal Password</label>
            <input
              type="text"
              value={data.portal_password || data.portal_temp_password || ''}
              onChange={(e) => {
                onChange('portal_password', e.target.value);
                onChange('portal_temp_password', e.target.value);
              }}
              placeholder="e.g. Edu@1024"
              className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink font-mono outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentContactAddressTab;
