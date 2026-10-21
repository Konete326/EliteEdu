import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Calendar, CreditCard, BookmarkCheck } from 'lucide-react';
import SearchableSelect from '../../common/SearchableSelect';

const REASON_PRESETS = [
  'Residential Relocation',
  'Branch Reorganization',
  'Closer to Residence',
  'Academic Program Shift'
];

const TransferTargetFields = ({
  form,
  setForm,
  campuses = [],
  grades = [],
  isStudent,
  selectedPerson
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const currentCampusId = selectedPerson?.campus_id?._id || selectedPerson?.campus_id;

  const campusOptions = campuses
    .filter((c) => String(c._id) !== String(currentCampusId))
    .map((c) => ({
      value: c._id,
      label: c.name,
      sublabel: c.address || 'Branch Campus'
    }));

  return (
    <div className="space-y-3.5">
      <SearchableSelect
        label="Destination Branch / Campus *"
        value={form.to_campus_id}
        onChange={(val) => setForm({ ...form, to_campus_id: val })}
        options={campusOptions}
        placeholder="Select the new target branch..."
      />

      <div>
        <label className="block text-xs font-semibold text-ink dark:text-white mb-1.5">
          Reason for Relocation *
        </label>
        <input
          type="text"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          placeholder="e.g. Residential relocation, branch reorganization..."
          required
          className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-white/5 text-xs text-ink dark:text-white outline-none focus:border-primary font-medium"
        />

        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className="text-[10px] text-ink-muted flex items-center gap-1">
            <BookmarkCheck size={11} className="text-primary" /> Quick Presets:
          </span>
          {REASON_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setForm({ ...form, reason: preset })}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                form.reason === preset
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted hover:text-ink border-line dark:border-line-dark'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full py-2 px-3 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/30 dark:bg-surface-secondary-dark/30 hover:bg-surface-secondary text-xs font-bold text-ink-muted hover:text-ink transition-all flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal size={13} className="text-primary" />
            <span>Advanced Customizations (Class, Section, Date & Fees)</span>
          </span>
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showAdvanced && (
          <div className="mt-2.5 p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/20 dark:bg-surface-secondary-dark/20 space-y-3 animate-in fade-in duration-150">
            {isStudent && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-ink-muted mb-1">
                    Override Target Class (Optional)
                  </label>
                  <select
                    value={form.to_grade_id}
                    onChange={(e) => setForm({ ...form, to_grade_id: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs text-ink dark:text-white font-medium outline-none focus:border-primary"
                  >
                    <option value="">Keep Same Grade ({selectedPerson?.current_grade?.name || 'Current'})</option>
                    {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ink-muted mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    value={form.to_section}
                    onChange={(e) => setForm({ ...form, to_section: e.target.value.toUpperCase() })}
                    placeholder="e.g. A"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs text-ink dark:text-white font-bold outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-ink-muted mb-1 flex items-center gap-1">
                <Calendar size={11} className="text-primary" />
                <span>Effective Transfer Date</span>
              </label>
              <input
                type="date"
                value={form.transfer_date}
                onChange={(e) => setForm({ ...form, transfer_date: e.target.value })}
                required
                className="w-full px-2.5 py-1.5 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs text-ink dark:text-white font-semibold outline-none focus:border-primary"
              />
            </div>

            {isStudent && (
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.transfer_unpaid_dues}
                  onChange={(e) => setForm({ ...form, transfer_unpaid_dues: e.target.checked })}
                  className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] font-semibold text-ink dark:text-white flex items-center gap-1">
                  <CreditCard size={12} className="text-emerald-500" />
                  <span>Migrate unpaid challans and dues to destination branch</span>
                </span>
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferTargetFields;
