import { useState, useEffect } from 'react';
import { BarChart2, Plus, Check } from 'lucide-react';
import GradingScaleRow from './GradingScaleRow';
import ConfirmModal from '../../common/ConfirmModal';

const MarksGradingTab = ({ initialScale = [], onSave, saving = false }) => {
  const [scale, setScale] = useState(initialScale);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    if (initialScale?.length) setScale(initialScale);
  }, [initialScale]);

  const handleChange = (index, field, value) => {
    setScale((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const handleAddGrade = () => {
    setScale((prev) => [...prev, { grade: '', percent_from: 0, percent_upto: 0, status: 'PASS', remarks: '' }]);
  };

  const handleDeleteConfirm = () => {
    if (deleteIndex !== null) {
      setScale((prev) => prev.filter((_, idx) => idx !== deleteIndex));
      setDeleteIndex(null);
    }
  };

  const getRowError = (row) => {
    if (!row.grade?.trim()) return 'Grade name is required';
    const from = Number(row.percent_from);
    const upto = Number(row.percent_upto);
    if (isNaN(from) || from < 0 || from > 100) return '% From must be 0-100';
    if (isNaN(upto) || upto < 0 || upto > 100) return '% Upto must be 0-100';
    if (from > upto) return '% From cannot exceed % Upto';
    return '';
  };

  const hasAnyErrors = scale.some((row) => !!getRowError(row));

  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark flex items-center justify-center shrink-0">
          <BarChart2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-ink dark:text-ink-dark">Customize Grading Scale</h2>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Define grade ranges and pass/fail status for student reports.</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-line dark:border-line-dark rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary/70 dark:bg-[#141418] text-[11px] font-bold text-ink-muted dark:text-ink-muted-dark uppercase tracking-wider border-b border-line dark:border-line-dark">
            <tr>
              <th className="px-4 py-3">Grade</th>
              <th className="px-4 py-3">% From</th>
              <th className="px-4 py-3">% Upto</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 dark:divide-white/5 bg-surface dark:bg-[#0c0c0f]">
            {scale.map((row, idx) => (
              <GradingScaleRow
                key={row._id || idx}
                row={row}
                index={idx}
                onChange={handleChange}
                onDelete={setDeleteIndex}
                errorMsg={getRowError(row)}
                disabled={saving}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={handleAddGrade}
          disabled={saving}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark font-semibold text-xs hover:bg-primary/25 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Grade</span>
        </button>

        <button
          type="button"
          onClick={() => onSave(scale)}
          disabled={saving || hasAnyErrors || scale.length === 0}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-xs shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Grading Scale'}</span>
        </button>
      </div>

      <ConfirmModal
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Grade Row"
        message={`Are you sure you want to remove ${scale[deleteIndex]?.grade || 'this grade'}?`}
        confirmText="Delete"
        confirmStyle="danger"
      />
    </div>
  );
};

export default MarksGradingTab;
