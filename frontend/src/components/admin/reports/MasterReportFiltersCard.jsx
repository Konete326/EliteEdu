import { Filter, Play, RotateCcw } from 'lucide-react';
import MasterReportFilterInputs from './MasterReportFilterInputs';

const MasterReportFiltersCard = ({
  category = 'student',
  subReport = '',
  filters = {},
  onFilterChange,
  grades = [],
  exams = [],
  onGenerate,
  onReset,
  loading = false
}) => {
  return (
    <div className="p-4 rounded-2xl bg-surface border border-line shadow-2xs space-y-3.5 print:hidden">
      <div className="flex items-center justify-between pb-2 border-b border-line">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-ink tracking-wider">
          <Filter size={14} className="text-primary" />
          <span>Active Report Filters &bull; {category.replace('_', ' ').toUpperCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs items-end">
        <MasterReportFilterInputs
          category={category}
          subReport={subReport}
          filters={filters}
          onFilterChange={onFilterChange}
          grades={grades}
          exams={exams}
        />

        <div className="flex items-center gap-1.5 pt-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Play size={11} fill="currentColor" />
            <span>Generate</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="p-2 rounded-xl border border-line bg-surface hover:bg-surface-secondary text-ink-muted hover:text-ink cursor-pointer transition-colors"
            title="Reset Filters"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterReportFiltersCard;
