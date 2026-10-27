import { X, User, Users, ShieldCheck } from 'lucide-react';

const TABS = [
  { id: 'bio', label: 'Student Bio & Academic', icon: User },
  { id: 'parents', label: 'Parents Details (Optional)', icon: Users },
  { id: 'contact', label: 'Contact & Credentials (Optional)', icon: ShieldCheck }
];

const TeacherStudentProfileModalHeader = ({ isEdit, studentName, activeTab, onSelectTab, onClose }) => {
  return (
    <>
      <div className="p-4 sm:p-5 border-b border-line dark:border-line-dark flex items-center justify-between">
        <div>
          <h3 className="font-black text-sm text-ink dark:text-ink-dark">
            {isEdit ? `Edit Profile: ${studentName}` : 'Enroll New Student in My Class'}
          </h3>
          <p className="text-[11px] text-ink-muted">Authorized Class Teacher Profile Management Studio</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 rounded-xl hover:bg-surface-secondary text-ink-muted cursor-pointer">
          <X size={18} />
        </button>
      </div>

      <div className="flex border-b border-line dark:border-line-dark px-4 bg-surface-secondary/30 gap-1 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTab(t.id)}
              className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                active ? 'border-primary text-primary' : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              <Icon size={13} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default TeacherStudentProfileModalHeader;
