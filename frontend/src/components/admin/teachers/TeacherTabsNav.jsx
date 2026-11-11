import {
  User, BookOpen, Smartphone,
  MessageSquare, FileText, Activity
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
  return (
    <div className="border-b border-line dark:border-line-dark overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max pb-px">
        {ALL_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
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
  );
};

export default TeacherTabsNav;
