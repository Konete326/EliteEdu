const GovtServiceFields = ({ formData, onChange, isGovt }) => {
  return (
    <div className="space-y-3 pt-2 border-t border-line dark:border-line-dark">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Supervisor</label>
          <input
            type="text"
            value={formData.supervisor || ''}
            onChange={(e) => onChange('supervisor', e.target.value)}
            placeholder="Reporting Officer"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Joining Date</label>
          <input
            type="date"
            value={formData.joining_date ? formData.joining_date.slice(0, 10) : ''}
            onChange={(e) => onChange('joining_date', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Regularization Date</label>
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
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Appointment Order No</label>
          <input
            type="text"
            value={formData.appointment_order_no || ''}
            onChange={(e) => onChange('appointment_order_no', e.target.value)}
            placeholder="Ref: DEO/2026/01"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Appointment Date</label>
          <input
            type="date"
            value={formData.appointment_date ? formData.appointment_date.slice(0, 10) : ''}
            onChange={(e) => onChange('appointment_date', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
        {!isGovt && (
          <div>
            <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Basic Salary (PKR)</label>
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
    </div>
  );
};

export default GovtServiceFields;
