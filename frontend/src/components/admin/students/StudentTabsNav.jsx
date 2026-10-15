import { User, Users, Phone, GraduationCap, BookOpen, Smartphone, FileText } from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Basic & Fee', icon: User },
  { id: 'family', label: 'Family & Guardians', icon: Users },
  { id: 'contact', label: 'Contact & Address', icon: Phone },
  { id: 'academic', label: 'Academic Record', icon: GraduationCap },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'app_settings', label: 'App Settings', icon: Smartphone },
  { id: 'documents', label: 'Media & Docs', icon: FileText }
];

const StudentTabsNav = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-line dark:border-white/10 scrollbar-none">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                : 'border-transparent text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-white hover:bg-surface-secondary dark:hover:bg-white/[0.08] dark:hover:border-white/10'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-white' : 'text-ink-muted dark:text-ink-muted-dark group-hover:text-ink dark:group-hover:text-white'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default StudentTabsNav;
