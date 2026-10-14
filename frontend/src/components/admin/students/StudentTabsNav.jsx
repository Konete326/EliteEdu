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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink-sub hover:text-ink hover:bg-surface-secondary dark:hover:bg-[#141414]'
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

export default StudentTabsNav;
