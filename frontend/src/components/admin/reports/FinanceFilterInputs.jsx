const FinanceFilterInputs = ({ filters = {}, onFilterChange, grades = [] }) => {
  return (
    <>
      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">From Date</label>
        <input
          type="date"
          value={filters.from_date || ''}
          onChange={(e) => onFilterChange('from_date', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">To Date</label>
        <input
          type="date"
          value={filters.to_date || ''}
          onChange={(e) => onFilterChange('to_date', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Class</label>
        <select
          value={filters.grade_id || 'all'}
          onChange={(e) => onFilterChange('grade_id', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        >
          <option value="all">All Classes</option>
          {grades.map((g) => (
            <option key={g._id} value={g._id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Payment Mode</label>
        <select
          value={filters.payment_mode || 'all'}
          onChange={(e) => onFilterChange('payment_mode', e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs"
        >
          <option value="all">All Modes</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Online / Card">Online / Card</option>
          <option value="Cheque">Cheque</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">Search</label>
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          placeholder="Receipt, GR or Name..."
          className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary text-xs placeholder:text-ink-muted"
        />
      </div>
    </>
  );
};

export default FinanceFilterInputs;
