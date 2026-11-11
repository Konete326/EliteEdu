import {
  User, BookOpen, Smartphone,
  MessageSquare, FileText, Activity, ChevronLeft, ChevronRight
} from 'lucide-react';

const ALL_TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'classes', label: 'Classes', icon: BookOpen },
  { id: 'app_settings', label: 'App Settings', icon: Smartphone },
  { id: 'follow_up', label: 'Follow-up History', icon: MessageSquare },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'active_sessions', label: 'Active Sessions', icon: Activity }
];

const TeacherTabsNav = ({ activeTab, onTabChange }) => {
  const activeIdx = Math.max(0, ALL_TABS.findIndex((t) => t.id === activeTab));

  const handlePrev = () => {
    const prevIdx = activeIdx > 0 ? activeIdx - 1 : ALL_TABS.length - 1;
    onTabChange(ALL_TABS[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = activeIdx < ALL_TABS.length - 1 ? activeIdx + 1 : 0;
    onTabChange(ALL_TABS[nextIdx].id);
  };

  const currentTab = ALL_TABS[activeIdx] || ALL_TABS[0];
  const ActiveIcon = currentTab.icon;

  return (
    <div className="w-full">
      <div className="sm:hidden w-full flex flex-col gap-1.5 p-1 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-2xs">
        <div className="w-full flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-line-dark flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer active:scale-95 transition-all shrink-0"
            aria-label="Previous Staff Tab"
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
            aria-label="Next Staff Tab"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 pb-0.5">
          {ALL_TABS.map((tab, idx) => (
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

      <div className="hidden sm:block border-b border-line dark:border-line-dark overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max pb-px">
          {ALL_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-primary text-primary dark:text-primary-dark'
                    : 'border-transparent text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-white hover:border-line dark:hover:border-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeacherTabsNav;
