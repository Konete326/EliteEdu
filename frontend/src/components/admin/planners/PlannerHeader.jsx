import { BookOpen, Calendar, Printer } from 'lucide-react';

const TABS = [
  { id: 'Lesson_Plan', label: '1. Academic Lesson Planner', icon: BookOpen },
  { id: 'Events_Calendar', label: '2. School Events, PTM & Holidays Calendar', icon: Calendar }
];

const PlannerHeader = ({ activeTab, onTabChange, stats = {}, onPrint }) => {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
            {activeTab === 'Lesson_Plan' ? <BookOpen className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">
              {activeTab === 'Lesson_Plan' ? 'Academic Lesson Planner Studio' : 'School Events, PTM & Holidays Calendar'}
            </h1>
            <p className="text-xs font-semibold text-ink-muted">
              {activeTab === 'Lesson_Plan'
                ? 'Curriculum syllabus pacing, weekly instructional objectives, and teaching aids'
                : 'Campus academic calendar, public holidays, parent-teacher meetings, and functions'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs">
            <span className="text-[10px] uppercase font-bold text-primary block">Total Entries</span>
            <span className="font-black text-primary">{stats.total || 0}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <span className="text-[10px] uppercase font-bold text-amber-600 block">In Progress</span>
            <span className="font-black text-amber-700 dark:text-amber-400">{stats.inProgress || 0}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Completed</span>
            <span className="font-black text-emerald-700 dark:text-emerald-400">{stats.completed || 0}</span>
          </div>
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line text-xs font-bold text-ink hover:border-primary shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-primary" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-surface-secondary/40 border border-line text-ink-muted hover:text-ink'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlannerHeader;
