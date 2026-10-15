const GovtServiceFields = ({ formData, onChange, isGovt }) => {
  return (
    <div className="space-y-3 pt-2 border-t border-line dark:border-line-dark">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Supervisor (Optional)</label>
          <input
            type="text"
            value={formData.supervisor || ''}
            onChange={(e) => onChange('supervisor', e.target.value)}
            placeholder="Reporting Officer"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Joining Date (Optional)</label>
          <input
            type="date"
            value={formData.joining_date ? formData.joining_date.slice(0, 10) : ''}
            onChange={(e) => onChange('joining_date', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Regularization Date (Optional)</label>
          <input
            type="date"
            value={formData.regularization_date ? formData.regularization_date.slice(0, 10) : ''}
            onChange={(e) => onChange('regularization_date', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Appointment Order No (Optional)</label>
          <input
            type="text"
            value={formData.appointment_order_no || ''}
            onChange={(e) => onChange('appointment_order_no', e.target.value)}
            placeholder="Ref: DEO/2026/01"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Appointment Date (Optional)</label>
          <input
            type="date"
            value={formData.appointment_date ? formData.appointment_date.slice(0, 10) : ''}
            onChange={(e) => onChange('appointment_date', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
        {!isGovt && (
          <div>
            <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Basic Salary (Optional)</label>
            <input
              type="number"
              value={formData.basic_salary || ''}
              onChange={(e) => onChange('basic_salary', Number(e.target.value) || 0)}
              placeholder="e.g. 45000"
              className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none font-bold"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-line dark:border-line-dark">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">SEMIS Code (Optional)</label>
          <input
            type="text"
            value={formData.semis_code || ''}
            onChange={(e) => onChange('semis_code', e.target.value)}
            placeholder="408110114"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Vendor No (Optional)</label>
          <input
            type="text"
            value={formData.vendor_no || ''}
            onChange={(e) => onChange('vendor_no', e.target.value)}
            placeholder="Vendor ID"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">SED # (Optional)</label>
          <input
            type="text"
            value={formData.sed_no || ''}
            onChange={(e) => onChange('sed_no', e.target.value)}
            placeholder="SED Code"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Blood Group (Optional)</label>
          <select
            value={formData.blood_group || ''}
            onChange={(e) => onChange('blood_group', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none cursor-pointer"
          >
            <option value="">Not Specified</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default GovtServiceFields;
