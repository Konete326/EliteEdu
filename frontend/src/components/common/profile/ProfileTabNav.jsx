import { User, Phone, GraduationCap, Lock, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

const TABS = [
  { id: 'personal', label: 'Personal & Identity', icon: User },
  { id: 'contact', label: 'Contact & Address', icon: Phone },
  { id: 'qualification', label: 'Qualifications & Bank', icon: GraduationCap },
  { id: 'security', label: 'Password & Security', icon: Lock, comingSoon: true },
  { id: 'permissions', label: 'Permissions & Classes', icon: ShieldCheck, comingSoon: true }
];

const ProfileTabNav = ({ activeTab, onSelectTab }) => {
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
  const ActiveIcon = currentTab.icon;

  return (
    <div className="w-full">
      <div className="sm:hidden w-full flex flex-col gap-1.5 p-1 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-2xs">
        <div className="w-full flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-line-dark flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer active:scale-95 transition-all shrink-0"
            aria-label="Previous Profile Tab"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold shadow-xs truncate">
            <ActiveIcon className="w-4 h-4 shrink-0 text-white" />
            <span className="truncate">{currentTab.label}</span>
            {currentTab.comingSoon && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/20 text-white border border-white/30 shrink-0">
                Coming Soon
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-line-dark flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer active:scale-95 transition-all shrink-0"
            aria-label="Next Profile Tab"
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

      <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-line dark:border-line-dark scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.comingSoon && (
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                  isActive
                    ? 'bg-white/20 text-white border-white/30'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                }`}>
                  Coming Soon
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileTabNav;
