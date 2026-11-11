import { Link } from 'react-router-dom';
import { Users, BookOpen, UserCheck, Calendar, TrendingUp, FileSpreadsheet, Printer, ChevronLeft, ChevronRight } from 'lucide-react';

const TABS = [
  { id: 'class_wise', label: 'Class-wise', icon: Users },
  { id: 'class_subject', label: 'Class & Subject', icon: BookOpen },
  { id: 'student_subject', label: 'Student & Subject', icon: UserCheck },
  { id: 'date_range', label: 'Date Range', icon: Calendar },
  { id: 'performance', label: 'Performance', icon: TrendingUp }
];

export default function ResultsHeaderAndTabs({ activeTab, setActiveTab, onPrint }) {
  const activeIdx = Math.max(0, TABS.findIndex((t) => t.id === activeTab));

  const handlePrev = () => {
    const prevIdx = activeIdx > 0 ? activeIdx - 1 : TABS.length - 1;
    setActiveTab(TABS[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = activeIdx < TABS.length - 1 ? activeIdx + 1 : 0;
    setActiveTab(TABS[nextIdx].id);
  };

  const currentTab = TABS[activeIdx] || TABS[0];
  const ActiveIcon = currentTab.icon;

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
          <Link to="/admin/class-tests/manage" className="text-primary hover:underline flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Class Tests
          </Link>
          <span>&gt;</span>
          <span className="text-text-primary dark:text-text-primary-dark">Test Results & Reports</span>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/class-tests/manage" className="px-3 py-1.5 text-xs font-bold rounded-xl border border-line dark:border-line-dark hover:bg-hover text-text-primary dark:text-text-primary-dark transition-colors">
            Manage Test Marks
          </Link>
          <button type="button" onClick={onPrint} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shadow-2xs">
            <Printer className="w-3.5 h-3.5" /> Print Report
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="sm:hidden w-full flex flex-col gap-1.5 p-1 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-2xs">
          <div className="w-full flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-line-dark flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer active:scale-95 transition-all shrink-0"
              aria-label="Previous Report Tab"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold shadow-xs truncate">
              <ActiveIcon className="w-4 h-4 shrink-0 text-white" />
              <span className="truncate">{currentTab.label}</span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-line-dark flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer active:scale-95 transition-all shrink-0"
              aria-label="Next Report Tab"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 pb-0.5">
            {TABS.map((tab, idx) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === activeIdx ? 'w-5 bg-primary' : 'w-1.5 bg-line dark:bg-line-dark'
                }`}
                aria-label={tab.label}
              />
            ))}
          </div>
        </div>

        <div className="hidden sm:flex p-1.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs items-center gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${isActive ? 'bg-primary text-white shadow-xs' : 'text-text-muted hover:text-text-primary hover:bg-hover dark:hover:bg-hover-dark'}`}>
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
