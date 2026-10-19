const StudentAddressTab = ({ data, onChange }) => {
  const address = data.address || {};

  const handleAddressChange = (field, val) => {
    onChange('address', { ...address, [field]: val });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
          Current Residential Address
        </label>
        <textarea
          rows={2}
          value={address.current_address || ''}
          onChange={(e) => handleAddressChange('current_address', e.target.value)}
          placeholder="House/flat number, street name, block/sector..."
          className="w-full px-3 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary resize-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
          Permanent Address
        </label>
        <textarea
          rows={2}
          value={address.permanent_address || ''}
          onChange={(e) => handleAddressChange('permanent_address', e.target.value)}
          placeholder="Village/city, district, province..."
          className="w-full px-3 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary resize-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
          City / Suburb / Area
        </label>
        <input
          type="text"
          value={address.area || ''}
          onChange={(e) => handleAddressChange('area', e.target.value)}
          placeholder="e.g. Gulshan-e-Iqbal, Karachi"
          className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
        />
      </div>
    </div>
  );
};

export default StudentAddressTab;
