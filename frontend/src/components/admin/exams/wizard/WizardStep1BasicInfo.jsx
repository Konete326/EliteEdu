const TERMS = ['First Term', 'Mid Term', 'Final Term', 'Monthly Test', 'Send-Up', 'Mock Exam'];
const STATUSES = ['Scheduled', 'Ongoing', 'Marks_Entry', 'Published'];

const WizardStep1BasicInfo = ({ formData, onChange, campuses = [] }) => {
  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="border-b border-line dark:border-white/10 pb-3">
        <h3 className="font-bold text-sm text-ink dark:text-ink-dark">Step 1: Exam General Information</h3>
        <p className="text-xs text-ink-muted">Define the institutional title, academic session, exam term, and scheduling dates.</p>
      </div>

      <div className="space-y-3.5 text-xs">
        <div>
          <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Exam Title *</label>
          <input
            type="text"
            required
            value={formData.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="e.g. Mid-Term Examination 2026-27"
            className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Term Type</label>
            <select
              value={formData.term_type || 'Mid Term'}
              onChange={(e) => onChange({ term_type: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary cursor-pointer"
            >
              {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Academic Session</label>
            <input
              type="text"
              value={formData.academic_session || '2026-2027'}
              onChange={(e) => onChange({ academic_session: e.target.value })}
              placeholder="2026-2027"
              className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Campus Scope</label>
            <select
              value={formData.campus_id || ''}
              onChange={(e) => onChange({ campus_id: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary cursor-pointer"
            >
              <option value="">All Campuses (Main HQ)</option>
              {campuses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Start Date</label>
            <input
              type="date"
              value={formData.start_date ? formData.start_date.slice(0, 10) : ''}
              onChange={(e) => onChange({ start_date: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary cursor-pointer"
            />
          </div>
          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-1">End Date</label>
            <input
              type="date"
              value={formData.end_date ? formData.end_date.slice(0, 10) : ''}
              onChange={(e) => onChange({ end_date: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary cursor-pointer"
            />
          </div>
          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Passing Percentage (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.pass_percentage ?? 33}
              onChange={(e) => onChange({ pass_percentage: Number(e.target.value) || 33 })}
              className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Initial Status</label>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onChange({ status: st })}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-colors cursor-pointer ${
                  formData.status === st
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface-secondary/40 dark:bg-white/5 border-line dark:border-white/10 text-ink-muted'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardStep1BasicInfo;
