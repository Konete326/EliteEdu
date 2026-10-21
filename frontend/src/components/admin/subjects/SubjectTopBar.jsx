import { useMemo } from 'react';
import { Plus, Search, X, DownloadCloud, BookOpen } from 'lucide-react';
import { DEFAULT_CLASSES } from '../../../utils/curriculumPresets';
import SearchableSelect from '../../common/SearchableSelect';

const SubjectTopBar = ({
  searchQuery,
  onSearchChange,
  campuses = [],
  grades = [],
  selectedCampus,
  onCampusChange,
  selectedClass,
  onClassChange,
  selectedStream = 'all',
  onStreamChange,
  onAutoLoad,
  onAddClick,
  isSeeding,
  totalItems = 0
}) => {
  const classList = grades.length > 0 ? grades.map((g) => g.name || g) : DEFAULT_CLASSES;

  const campusOptions = useMemo(() => [
    { value: 'all', label: 'All Campuses' },
    ...campuses.map((c) => ({
      value: c._id,
      label: c.name,
      subtext: c.code ? `Code: ${c.code}` : ''
    }))
  ], [campuses]);

  const classOptions = useMemo(() => [
    { value: 'all', label: 'All Classes' },
    ...classList.map((cls) => ({ value: cls, label: cls }))
  ], [classList]);

  const streamOptions = [
    { value: 'all', label: 'All Groups' },
    { value: 'General', label: 'General' },
    { value: 'Science (Biology)', label: 'Science with Biology' },
    { value: 'Science (Computer)', label: 'Science with Computer' },
    { value: 'Arts / Humanities', label: 'Arts / Humanities' }
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-2xs">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-ink dark:text-white tracking-tight">
                Subjects
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted border border-line dark:border-line-dark">
                {totalItems} {totalItems === 1 ? 'Subject' : 'Subjects'}
              </span>
            </div>
            <p className="text-xs text-ink-muted">
              Manage school subjects, classes, and teachers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
          <button
            type="button"
            onClick={onAutoLoad}
            disabled={isSeeding}
            className="px-3.5 py-2 rounded-xl border border-primary/30 text-primary dark:text-primary-dark hover:bg-primary/10 text-xs font-bold transition-all shadow-2xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <DownloadCloud size={14} className="text-primary" />
            <span>{isSeeding ? 'Loading...' : 'Load Standard Subjects'}</span>
          </button>

          <button
            type="button"
            onClick={onAddClick}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        <div className="relative">
          <Search size={14} className="text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by subject or code..."
            className="w-full pl-9 pr-7 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 text-xs text-ink dark:text-white outline-none focus:border-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div>
          <SearchableSelect
            options={campusOptions}
            value={selectedCampus}
            onChange={onCampusChange}
            placeholder="Filter by campus..."
            size="sm"
          />
        </div>

        <div>
          <SearchableSelect
            options={classOptions}
            value={selectedClass}
            onChange={onClassChange}
            placeholder="Filter by class..."
            size="sm"
          />
        </div>

        {onStreamChange && (
          <div>
            <SearchableSelect
              options={streamOptions}
              value={selectedStream}
              onChange={onStreamChange}
              placeholder="Filter by group..."
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectTopBar;