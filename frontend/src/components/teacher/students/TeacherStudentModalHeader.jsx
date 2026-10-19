import { X, User, ShieldCheck, Users, MapPin } from 'lucide-react';

const TABS = [
  { id: 'basic', label: 'Basic & Academic', icon: User },
  { id: 'identity', label: 'Identity & Health', icon: ShieldCheck },
  { id: 'parents', label: 'Parents & Contacts', icon: Users },
  { id: 'address', label: 'Address', icon: MapPin }
];

const TeacherStudentModalHeader = ({ isEdit, studentName, activeTab, onSelectTab, onClose }) => {
  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 border-b border-line dark:border-line-dark">
        <div>
          <h3 className="text-base font-black text-ink dark:text-ink-dark tracking-tight">
            {isEdit ? `Edit Student Profile: ${studentName}` : 'Enroll New Student into My Class'}
          </h3>
          <p className="text-[11px] text-ink-muted">Authorized class teacher direct record management.</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-surface-secondary cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 px-6 pt-3 border-b border-line dark:border-line-dark overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                active ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default TeacherStudentModalHeader;
