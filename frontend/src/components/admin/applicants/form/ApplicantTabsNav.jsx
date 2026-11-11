import { User, Briefcase, MapPin, FileText, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'professional', label: 'Professional', icon: Briefcase },
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'followups', label: 'Follow-ups', icon: MessageSquare }
];

const ApplicantTabsNav = ({ activeTab, onTabChange }) => {
  const activeIdx = Math.max(0, TABS.findIndex((t) => t.id === activeTab));

  const handlePrev = () => {
    const prevIdx = activeIdx > 0 ? activeIdx - 1 : TABS.length - 1;
    onTabChange(TABS[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = activeIdx < TABS.length - 1 ? activeIdx + 1 : 0;
    onTabChange(TABS[nextIdx].id);
  };

  const currentTab = TABS[activeIdx] || TABS[0];
  const ActiveIcon = currentTab.icon;

  return (
    <div className="w-full">
      <div className="sm:hidden w-full flex flex-col gap-1.5 p-1 bg-surface dark:bg-surface-dark border border-line dark:border-white/10 rounded-2xl shadow-2xs">
        <div className="w-full flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-white/10 flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer active:scale-95 transition-all shrink-0"
            aria-label="Previous Applicant Tab"
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
            className="w-8 h-8 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-white/10 flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer active:scale-95 transition-all shrink-0"
            aria-label="Next Applicant Tab"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 pb-0.5">
          {TABS.map((tab, idx) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === activeIdx ? 'w-5 bg-primary' : 'w-1.5 bg-line dark:bg-line-dark'
              }`}
              aria-label={tab.label}
            />
          ))}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-line dark:border-white/10 no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-dark border-b-2 border-primary shadow-xs'
                  : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-white hover:bg-surface-secondary dark:hover:bg-white/[0.08]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicantTabsNav;
