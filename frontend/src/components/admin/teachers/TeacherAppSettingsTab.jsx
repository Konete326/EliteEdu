import { Smartphone, CheckSquare } from 'lucide-react';

const PERMISSION_KEYS = [
  { key: 'my_profile', label: 'My Profile' },
  { key: 'homework', label: 'Homework' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'examination', label: 'Examination' },
  { key: 'resources', label: 'Resources' },
  { key: 'events', label: 'Events' },
  { key: 'timetable', label: 'Timetable' },
  { key: 'students', label: 'Students' },
  { key: 'update_picture', label: 'Update Picture' },
  { key: 'complaints', label: 'Complaints' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'counseling', label: 'Counseling' },
  { key: 'lost_and_found', label: 'Lost & Found' },
  { key: 'quizzes', label: 'Quizzes' },
  { key: 'lectures', label: 'Lectures' },
  { key: 'online_classes', label: 'Online Classes' },
  { key: 'planner', label: 'Planner' },
  { key: 'datesheet', label: 'Datesheet' },
  { key: 'salary', label: 'Salary Information', privateOnly: true }
];

const TeacherAppSettingsTab = ({ permissions = {}, onChange, schoolType }) => {
  const isGovt = schoolType === 'Government';
  const visiblePermissions = PERMISSION_KEYS.filter((p) => !(isGovt && p.privateOnly));

  const allActive = visiblePermissions.every((p) => permissions[p.key] !== false);

  const handleMasterToggle = () => {
    const nextVal = !allActive;
    const updated = { ...permissions };
    visiblePermissions.forEach((p) => { updated[p.key] = nextVal; });
    onChange(updated);
  };

  const handleToggle = (key) => {
    onChange({ ...permissions, [key]: permissions[key] === false });
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Staff Mobile App Permissions</h3>
            <p className="text-xs text-ink-muted">Control accessible modules on staff mobile & web portals.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleMasterToggle}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary text-xs font-bold hover:text-primary transition-all self-start sm:self-auto"
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>{allActive ? 'Deselect All' : 'Select All'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visiblePermissions.map((perm) => {
          const isEnabled = permissions[perm.key] !== false;
          return (
            <div
              key={perm.key}
              onClick={() => handleToggle(perm.key)}
              className="flex items-center justify-between p-3 rounded-xl border border-line dark:border-line-dark hover:bg-surface-secondary/40 cursor-pointer transition-colors"
            >
              <span className="text-xs font-semibold text-ink dark:text-ink-dark">{perm.label}</span>
              <div className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${isEnabled ? 'bg-primary' : 'bg-line dark:bg-line-dark'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherAppSettingsTab;
