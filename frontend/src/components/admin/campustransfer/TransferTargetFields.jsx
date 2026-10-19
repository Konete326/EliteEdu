import SearchableSelect from '../../common/SearchableSelect';

const TransferTargetFields = ({ form, setForm, campuses, grades, isStudent, selectedPerson }) => {
  const currentCampusId = selectedPerson?.campus_id?._id || selectedPerson?.campus_id;
  const campusOptions = campuses
    .filter((c) => String(c._id) !== String(currentCampusId))
    .map((c) => ({
      value: c._id,
      label: c.name,
      sublabel: c.code || c.address || 'Branch Campus'
    }));

  return (
    <div className="space-y-3">
      <SearchableSelect
        label="Destination Branch / Campus *"
        value={form.to_campus_id}
        onChange={(val) => setForm({ ...form, to_campus_id: val })}
        options={campusOptions}
        placeholder="Type to search destination branch..."
      />

      {isStudent && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-ink-muted mb-1">Target Class</label>
            <select
              value={form.to_grade_id}
              onChange={(e) => setForm({ ...form, to_grade_id: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-medium outline-none"
            >
              <option value="">Same as Current</option>
              {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-ink-muted mb-1">Section</label>
            <input
              type="text"
              value={form.to_section}
              onChange={(e) => setForm({ ...form, to_section: e.target.value.toUpperCase() })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-bold outline-none"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2">
        <div>
          <label className="block text-[10px] font-bold text-ink-muted mb-1">Transfer Date *</label>
          <input
            type="date"
            value={form.transfer_date}
            onChange={(e) => setForm({ ...form, transfer_date: e.target.value })}
            required
            className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-semibold outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-ink-muted mb-1">Reason for Relocation *</label>
          <input
            type="text"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="e.g. Residential relocation, branch restructuring"
            required
            className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-medium outline-none"
          />
        </div>
      </div>

      {isStudent && (
        <label className="flex items-center gap-2 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={form.transfer_unpaid_dues}
            onChange={(e) => setForm({ ...form, transfer_unpaid_dues: e.target.checked })}
            className="rounded text-primary focus:ring-primary w-4 h-4"
          />
          <span className="text-[11px] font-bold text-ink dark:text-ink-dark">Migrate Unpaid Fee Challans to New Branch</span>
        </label>
      )}
    </div>
  );
};

export default TransferTargetFields;
