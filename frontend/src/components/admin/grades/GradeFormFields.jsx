const GradeFormFields = ({
  name, setName,
  campusId, setCampusId,
  classTeacher, setClassTeacher,
  status, setStatus,
  campuses = [], teachers = []
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1">Grade Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. NURSERY, Grade V, Class VII"
          required
          className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-sm text-ink dark:text-ink-dark focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1">Campus (Optional)</label>
          <select
            value={campusId}
            onChange={(e) => setCampusId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          >
            <option value="">All / Main Campus</option>
            {campuses.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1">Class Teacher (Optional)</label>
          <select
            value={classTeacher}
            onChange={(e) => setClassTeacher(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          >
            <option value="">Unassigned</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-semibold text-ink dark:text-ink-dark">Status</span>
        <button
          type="button"
          onClick={() => setStatus(status === 'Active' ? 'Inactive' : 'Active')}
          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${status === 'Active' ? 'bg-primary' : 'bg-bad'}`}
        >
          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${status === 'Active' ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>
    </div>
  );
};

export default GradeFormFields;
