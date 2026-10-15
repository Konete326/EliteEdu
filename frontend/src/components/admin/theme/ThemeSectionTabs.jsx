import { LayoutGrid, Monitor, Paintbrush, Eye } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All Controls', icon: LayoutGrid },
  { id: 'interface', label: 'Interface & Mode', icon: Monitor },
  { id: 'branding', label: 'Colors & Chrome', icon: Paintbrush },
  { id: 'preview', label: 'Live Preview', icon: Eye }
];

const ThemeSectionTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface-secondary/70 dark:bg-surface-secondary-dark/70 border border-line dark:border-line-dark overflow-x-auto scrollbar-none">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-surface dark:bg-surface-dark text-primary shadow-xs border border-line dark:border-line-dark'
                : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSectionTabs;
