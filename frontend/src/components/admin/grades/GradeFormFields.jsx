const GradeFormFields = ({ name, setName, status, setStatus }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1">Grade / Class Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. NURSERY, Grade 1, Class VII, Matric"
          required
          className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-sm text-ink dark:text-ink-dark focus:ring-2 focus:ring-primary/20 outline-none"
        />
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
