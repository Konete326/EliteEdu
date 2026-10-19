const COLORS = {
  5: 'bg-emerald-500 text-white',
  4: 'bg-blue-600 text-white',
  3: 'bg-cyan-600 text-white',
  2: 'bg-amber-500 text-white',
  1: 'bg-rose-500 text-white'
};

const BehaviorRatingCell = ({ value = 5, onChange }) => (
  <div className="flex items-center gap-0.5 justify-center">
    {[1, 2, 3, 4, 5].map((n) => {
      const active = Number(value) === n;
      return (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`w-5 h-5 rounded-md text-[10px] font-black transition-all flex items-center justify-center ${
            active
              ? `${COLORS[n]} shadow-sm scale-110`
              : 'bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400 hover:bg-gray-200'
          }`}
        >
          {n}
        </button>
      );
    })}
  </div>
);

export default BehaviorRatingCell;
