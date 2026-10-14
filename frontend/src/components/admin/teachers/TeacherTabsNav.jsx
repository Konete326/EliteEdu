import {
  User, BookOpen, Smartphone, DollarSign, Shield,
  TrendingUp, CreditCard, MessageSquare, FileText, Activity
} from 'lucide-react';

const ALL_TABS = [
  { id: 'profile', label: 'Profile', icon: User, privateOnly: false },
  { id: 'classes', label: 'Classes', icon: BookOpen, privateOnly: false },
  { id: 'app_settings', label: 'App Settings', icon: Smartphone, privateOnly: false },
  { id: 'payroll', label: 'Payroll', icon: DollarSign, privateOnly: true },
  { id: 'security_deposit', label: 'Security Deposit', icon: Shield, privateOnly: true },
  { id: 'increment_history', label: 'Increment History', icon: TrendingUp, privateOnly: false },
  { id: 'loan_advance', label: 'Loan / Advance', icon: CreditCard, privateOnly: true },
  { id: 'follow_up', label: 'Follow-up History', icon: MessageSquare, privateOnly: false },
  { id: 'documents', label: 'Documents', icon: FileText, privateOnly: false },
  { id: 'active_sessions', label: 'Active Sessions', icon: Activity, privateOnly: false }
];

const TeacherTabsNav = ({ activeTab, onTabChange, schoolType }) => {
  const isGovt = schoolType === 'Government';
  const visibleTabs = ALL_TABS.filter((tab) => !(isGovt && tab.privateOnly));

  return (
    <div className="border-b border-line dark:border-line-dark overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max pb-px">
        {visibleTabs.map((tab) => {
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
                  : 'border-transparent text-ink-muted hover:text-ink hover:border-line dark:hover:border-line-dark'
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
