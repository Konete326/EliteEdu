import { User, Phone, GraduationCap, Lock, ShieldCheck } from 'lucide-react';

const TABS = [
  { id: 'personal', label: 'Personal & Identity', icon: User },
  { id: 'contact', label: 'Contact & Address', icon: Phone },
  { id: 'qualification', label: 'Qualifications & Bank', icon: GraduationCap },
  { id: 'security', label: 'Password & Security', icon: Lock },
  { id: 'permissions', label: 'Permissions & Classes', icon: ShieldCheck }
];

const ProfileTabNav = ({ activeTab, onSelectTab }) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-line dark:border-line-dark scrollbar-none">
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
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabNav;
