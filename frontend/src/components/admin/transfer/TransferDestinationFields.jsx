const TransferDestinationFields = ({
  campuses = [],
  grades = [],
  toCampusId,
  setToCampusId,
  toGradeId,
  setToGradeId,
  toSection,
  setToSection,
  effectiveDate,
  setEffectiveDate
}) => {
  return (
    <>
      <div>
        <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
          Destination Campus <span className="text-bad">*</span>
        </label>
        <select
          value={toCampusId}
          onChange={(e) => setToCampusId(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#141414] font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">-- Choose Destination Campus --</option>
          {campuses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} {c.address ? `(${c.address})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Destination Grade</label>
          <select
            value={toGradeId}
            onChange={(e) => setToGradeId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#141414] font-semibold outline-none focus:border-primary"
          >
            <option value="">Keep Same Grade</option>
            {grades.map((g) => (
              <option key={g._id} value={g._id}>{g.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Destination Section</label>
          <input
            type="text"
            value={toSection}
            onChange={(e) => setToSection(e.target.value)}
            placeholder="e.g. A"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#141414] font-semibold outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Effective Transfer Date</label>
        <input
          type="date"
          value={effectiveDate}
          onChange={(e) => setEffectiveDate(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#141414] font-semibold outline-none focus:border-primary"
        />
      </div>
    </>
  );
};

export default TransferDestinationFields;
