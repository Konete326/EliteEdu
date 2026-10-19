import { useNavigate } from 'react-router-dom';
import { AlertCircle, HeartHandshake, Search, FileCheck } from 'lucide-react';

const TABS = [
  { id: 'Complaint', label: '1. Complaints & Grievances', path: '/admin/complaints', icon: AlertCircle },
  { id: 'Counseling', label: '2. Student Counseling & Feedback', path: '/teacher/counseling', icon: HeartHandshake },
  { id: 'Lost_Found', label: '3. Lost & Found Desk', path: '/admin/lost-and-found', icon: Search },
  { id: 'Consent_Letter', label: '4. Parental Consent & News Circulars', path: '/admin/consent', icon: FileCheck }
];

const OperationsTabNav = ({ currentType, onTabChange }) => {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    if (onTabChange) onTabChange(tab.id);
    navigate(tab.path);
  };

  return (
    <div className="flex items-center gap-1.5 p-1 bg-surface-alt dark:bg-white/5 rounded-2xl border border-line dark:border-white/10 overflow-x-auto">
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = currentType === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTabClick(t)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-primary text-white shadow-xs font-bold'
                : 'text-text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default OperationsTabNav;
