import { Search, UserPlus, CalendarCheck, LayoutGrid, List } from 'lucide-react';

const TeacherRosterToolbar = ({
  search,
  onSearchChange,
  selectedSection,
  onSectionChange,
  sections = [],
  viewMode = 'grid',
  onViewModeChange,
  totalCount = 0,
  visibleCount = 0,
  onAddStudent,
  onAttendanceClick
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-ink dark:text-ink-dark tracking-tight">
              My Students Roster
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-ink-muted">
            Complete class enrollment directory with cards view and quick profile editing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden md:inline-flex p-1 rounded-xl bg-surface-secondary border border-line dark:border-line-dark">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-surface dark:bg-surface-dark text-primary shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
              title="Card View"
            >
              <LayoutGrid size={14} />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-surface dark:bg-surface-dark text-primary shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
              title="Table View"
            >
              <List size={14} />
              <span>Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onAddStudent}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <UserPlus size={14} /> <span>+ Add New Student</span>
          </button>
          <button
            type="button"
            onClick={onAttendanceClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-bold text-ink dark:text-ink-dark hover:border-primary transition-colors cursor-pointer"
          >
            <CalendarCheck size={14} /> <span>Attendance</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search student by name, father name or GR number..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={selectedSection}
          onChange={(e) => onSectionChange(e.target.value)}
          aria-label="Filter by Section"
          className="px-3 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark font-medium outline-none"
        >
          {sections.map((sec) => (
            <option key={sec} value={sec}>Section: {sec}</option>
          ))}
        </select>
      </div>

      {visibleCount > 0 && totalCount > 0 && (
        <div className="flex items-center justify-between text-[11px] text-ink-muted">
          <span>
            Showing <strong className="text-ink dark:text-ink-dark">{visibleCount}</strong> of <strong className="text-ink dark:text-ink-dark">{totalCount}</strong> students
          </span>
        </div>
      )}
    </div>
  );
};

export default TeacherRosterToolbar;
