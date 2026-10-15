import { User, Briefcase, MapPin, FileText, MessageSquare } from 'lucide-react';

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'professional', label: 'Professional', icon: Briefcase },
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'followups', label: 'Follow-ups', icon: MessageSquare }
];

const ApplicantTabsNav = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-line dark:border-white/10 no-scrollbar">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-dark border-b-2 border-primary shadow-xs'
                : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ApplicantTabsNav;
