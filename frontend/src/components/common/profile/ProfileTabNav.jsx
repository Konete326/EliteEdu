import { User, Phone, GraduationCap, Lock, ShieldCheck } from 'lucide-react';

const TABS = [
  { id: 'personal', label: 'Personal & Identity', icon: User },
  { id: 'contact', label: 'Contact & Address', icon: Phone },
  { id: 'qualification', label: 'Qualifications & Bank', icon: GraduationCap },
  { id: 'security', label: 'Password & Security', icon: Lock },
  { id: 'permissions', label: 'Permissions & Classes', icon: ShieldCheck, comingSoon: true }
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
  );
};

export default ProfileTabNav;
