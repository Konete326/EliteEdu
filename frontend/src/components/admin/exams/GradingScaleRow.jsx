import { Trash2, AlertCircle } from 'lucide-react';

const GradingScaleRow = ({
  row,
  index,
  onChange,
  onDelete,
  errorMsg = '',
  disabled = false
}) => {
  const isPass = row.status === 'PASS';

  return (
    <tr className={`transition-colors ${errorMsg ? 'bg-bad-soft/20 dark:bg-bad/10' : 'hover:bg-surface-secondary/40 dark:hover:bg-white/[0.02]'}`}>
      <td className="px-4 py-3">
        <input
          type="text"
          value={row.grade}
          disabled={disabled}
          onChange={(e) => onChange(index, 'grade', e.target.value)}
          placeholder="e.g. A+"
          className="w-full max-w-[130px] px-3 py-1.5 text-xs font-bold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#16161d] text-ink dark:text-ink-dark outline-none focus:border-primary transition-colors text-center uppercase"
        />
      </td>

      <td className="px-4 py-3">
        <input
          type="number"
          min="0"
          max="100"
          value={row.percent_from}
          disabled={disabled}
          onChange={(e) => onChange(index, 'percent_from', e.target.value)}
          placeholder="0"
          className="w-full max-w-[110px] px-3 py-1.5 text-xs font-mono font-semibold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#16161d] text-ink dark:text-ink-dark outline-none focus:border-primary transition-colors text-center"
        />
      </td>

      <td className="px-4 py-3">
        <input
          type="number"
          min="0"
          max="100"
          value={row.percent_upto}
          disabled={disabled}
          onChange={(e) => onChange(index, 'percent_upto', e.target.value)}
          placeholder="100"
          className="w-full max-w-[110px] px-3 py-1.5 text-xs font-mono font-semibold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#16161d] text-ink dark:text-ink-dark outline-none focus:border-primary transition-colors text-center"
        />
      </td>

      <td className="px-4 py-3">
        <select
          value={row.status}
          disabled={disabled}
          onChange={(e) => onChange(index, 'status', e.target.value)}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl border border-line dark:border-line-dark outline-none cursor-pointer transition-colors ${
            isPass
              ? 'bg-good/10 text-good border-good/30'
              : 'bg-bad/10 text-bad border-bad/30'
          }`}
        >
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
        </select>
        {errorMsg && (
          <p className="text-[10px] text-bad flex items-center gap-1 mt-1 font-medium">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{errorMsg}</span>
          </p>
        )}
      </td>

      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={() => onDelete(index)}
          disabled={disabled}
          title="Delete Grade"
          className="p-2 rounded-xl text-bad/80 hover:text-bad bg-bad-soft/60 hover:bg-bad-soft dark:bg-bad/10 dark:hover:bg-bad/20 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

export default GradingScaleRow;
