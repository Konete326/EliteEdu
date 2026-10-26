const RATING_CONFIG = {
  5: { label: '5 (Outstanding)', style: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
  4: { label: '4 (Very Good)', style: 'bg-primary-soft text-primary dark:text-primary-dark border-primary/30' },
  3: { label: '3 (Satisfactory)', style: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30' },
  2: { label: '2 (Fair)', style: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' },
  1: { label: '1 (Needs Work)', style: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30' }
};

const BehaviorRatingCell = ({ value = 5, onChange }) => {
  const currentVal = Number(value) || 5;
  const cfg = RATING_CONFIG[currentVal] || RATING_CONFIG[5];

  return (
    <div className="flex items-center justify-center p-0.5">
      <select
        value={currentVal}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-[50px] h-7 px-1 rounded-lg text-xs font-black text-center border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${cfg.style}`}
        title={`Rating: ${cfg.label}`}
      >
        <option value={5}>5 ★</option>
        <option value={4}>4 ★</option>
        <option value={3}>3 ★</option>
        <option value={2}>2 ★</option>
        <option value={1}>1 ★</option>
      </select>
    </div>
  );
};

export default BehaviorRatingCell;
