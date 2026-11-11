import { ChevronLeft, ChevronRight } from 'lucide-react';

const TABS = [
  { id: 'browse', label: 'Browse Sheets' },
  { id: 'attendance', label: 'Exam Attendance' },
  { id: 'results', label: 'Class Results' },
  { id: 'lock', label: 'Lock Results' },
  { id: 'settings', label: 'Exam Settings' }
];

const MarkSheetTabsHeader = ({ activeTab, onSelectTab }) => {
  const activeIdx = Math.max(0, TABS.findIndex((t) => t.id === activeTab));

  const handlePrev = () => {
    const prevIdx = activeIdx > 0 ? activeIdx - 1 : TABS.length - 1;
    onSelectTab(TABS[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = activeIdx < TABS.length - 1 ? activeIdx + 1 : 0;
    onSelectTab(TABS[nextIdx].id);
  };

  const currentTab = TABS[activeIdx] || TABS[0];

  return (
    <div className="w-full">
      <div className="sm:hidden w-full flex flex-col gap-1.5 p-1 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-2xs">
        <div className="w-full flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-line-dark flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer active:scale-95 transition-all shrink-0"
            aria-label="Previous Mark Sheet Tab"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center justify-center py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold shadow-xs truncate">
            <span className="truncate">{currentTab.label}</span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-line-dark flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer active:scale-95 transition-all shrink-0"
            aria-label="Next Mark Sheet Tab"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 pb-0.5">
          {TABS.map((tab, idx) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === activeIdx ? 'w-5 bg-primary' : 'w-1.5 bg-line dark:bg-line-dark'
              }`}
              aria-label={tab.label}
            />
          ))}
        </div>
      </div>

      <div className="hidden sm:flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-900 border-t-2 border-primary text-primary shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MarkSheetTabsHeader;
