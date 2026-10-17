import { ArrowLeft, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TeacherCardsFilterBar from './TeacherCardsFilterBar';

const STYLES = [
  { id: 'GovtSindh', label: 'Official Service Card' },
  { id: 'Style 1', label: 'Style 1 (Modern Executive)' },
  { id: 'Style 2', label: 'Style 2 (Minimalist Corporate)' },
  { id: 'Style 3', label: 'Style 3 (Landscape Badge)' }
];

const SIDES = [
  { id: 'both', label: 'Both (Front & Back)' },
  { id: 'front', label: 'Front Only' },
  { id: 'back', label: 'Back Only' }
];

const TeacherIdCardsToolbar = ({
  selectedStyle,
  onSelectStyle,
  sideMode,
  onSideModeChange,
  searchQuery,
  onSearchChange,
  campuses = [],
  selectedCampus,
  onCampusChange,
  selectedCount,
  totalCount,
  onToggleSelectAll,
  onExportPdf,
  isExporting
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 print:hidden">
      <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <Award className="w-4 h-4 text-primary" />
          <span className="font-bold text-ink dark:text-ink-dark">Staff Directory</span>
          <span>&gt;</span>
          <span className="text-primary font-bold">Service Cards Studio</span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/teachers')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#121217] text-xs font-bold text-ink dark:text-ink-dark hover:bg-surface-secondary shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      <div className="sticky top-[1px] z-20 mt-[1px] flex flex-wrap items-center justify-between gap-3 bg-surface/95 dark:bg-[#0c0c0f]/95 backdrop-blur-md border border-line dark:border-line-dark rounded-2xl p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-secondary/50 dark:bg-[#16161d] p-1 rounded-xl border border-line dark:border-line-dark">
            {STYLES.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectStyle(st.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedStyle === st.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-ink dark:text-ink-dark hover:bg-surface-secondary'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-surface-secondary/50 dark:bg-[#16161d] p-1 rounded-xl border border-line dark:border-line-dark">
            {SIDES.map((sd) => (
              <button
                key={sd.id}
                type="button"
                onClick={() => onSideModeChange(sd.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  sideMode === sd.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-ink dark:text-ink-dark hover:bg-surface-secondary'
                }`}
              >
                {sd.label}
              </button>
            ))}
          </div>
        </div>

        <TeacherCardsFilterBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          campuses={campuses}
          selectedCampus={selectedCampus}
          onCampusChange={onCampusChange}
          selectedCount={selectedCount}
          totalCount={totalCount}
          onToggleSelectAll={onToggleSelectAll}
          onExportPdf={onExportPdf}
          isExporting={isExporting}
        />
      </div>
    </div>
  );
};

export default TeacherIdCardsToolbar;
