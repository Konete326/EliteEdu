import { ChevronLeft, ChevronRight } from 'lucide-react';

const MobileTabStepper = ({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  desktopVariant = 'tabs',
  mobileBreakpoint = 'sm'
}) => {
  if (!tabs || tabs.length === 0) return null;

  const activeIdx = Math.max(0, tabs.findIndex((t) => t.id === activeTab));
  const currentTab = tabs[activeIdx] || tabs[0];
  const ActiveIcon = currentTab?.icon;

  const handlePrev = () => {
    const prevIdx = activeIdx > 0 ? activeIdx - 1 : tabs.length - 1;
    onChange(tabs[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = activeIdx < tabs.length - 1 ? activeIdx + 1 : 0;
    onChange(tabs[nextIdx].id);
  };

  const isXl = mobileBreakpoint === 'xl';
  const mobileWrapperClass = isXl ? 'xl:hidden' : 'sm:hidden';
  const desktopWrapperClass = isXl ? 'hidden xl:flex' : 'hidden sm:flex';

  return (
    <div className={`w-full ${className}`}>
      <div className={`${mobileWrapperClass} w-full flex flex-col gap-1.5 p-1 bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl shadow-xs`}>
        <div className="w-full flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-xl bg-surface-secondary/70 dark:bg-white/5 border border-line dark:border-white/10 flex items-center justify-center text-ink dark:text-white cursor-pointer active:scale-95 transition-all shrink-0"
            aria-label="Previous Section"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold shadow-xs truncate">
            {ActiveIcon && <ActiveIcon className="w-4 h-4 shrink-0 text-white" />}
            <span className="truncate">{currentTab.label}</span>
            {currentTab.badge && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/20 text-white border border-white/30 shrink-0">
                {currentTab.badge}
              </span>
            )}
            {currentTab.count !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-white/20 text-white shrink-0">
                {currentTab.count}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-xl bg-surface-secondary/70 dark:bg-white/5 border border-line dark:border-white/10 flex items-center justify-center text-ink dark:text-white cursor-pointer active:scale-95 transition-all shrink-0"
            aria-label="Next Section"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 pb-0.5">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === activeIdx
                  ? 'w-5 bg-primary'
                  : 'w-1.5 bg-line-dark/30 dark:bg-white/20 hover:bg-primary/50'
              }`}
              aria-label={`Jump to ${tab.label}`}
            />
          ))}
        </div>
      </div>

      <div className={`${desktopWrapperClass} items-center gap-1.5 overflow-x-auto pb-0.5`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface dark:bg-[#141414] text-ink-sub dark:text-ink-muted-dark hover:text-ink dark:hover:text-white border border-line dark:border-white/10 hover:border-line-hover'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-primary'}`} />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                }`}>
                  {tab.badge}
                </span>
              )}
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-surface-secondary text-ink-muted'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTabStepper;
