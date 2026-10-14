import { Smartphone, CheckSquare } from 'lucide-react';

const PERMISSION_KEYS = [
  { key: 'edit_profile', label: 'Edit Profile' },
  { key: 'homework', label: 'Homework' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'timetable', label: 'Timetable' },
  { key: 'online_classes', label: 'Online Classes' },
  { key: 'lectures', label: 'Lectures' },
  { key: 'date_sheet', label: 'Date Sheet' },
  { key: 'assessment', label: 'Assessments & Exams' },
  { key: 'learning_videos', label: 'Learning Videos' },
  { key: 'events', label: 'School Events' },
  { key: 'voice_notes', label: 'Voice Notes' },
  { key: 'gallery', label: 'Photo Gallery' },
  { key: 'apply_leave', label: 'Apply Leave' },
  { key: 'library', label: 'Library Books' },
  { key: 'complaints', label: 'Complaints / Support' },
  { key: 'certificate_request', label: 'Certificate Request' },
  { key: 'id_card', label: 'Digital ID Card' },
  { key: 'admit_card', label: 'Exam Admit Card' },
  { key: 'store', label: 'School Store' },
  { key: 'slc', label: 'School Leaving Certificate' }
];

const StudentAppSettingsTab = ({ appSettings = {}, onToggleSetting, onToggleAll }) => {
  const allActive = PERMISSION_KEYS.every((p) => appSettings[p.key] !== false);

  const handleMasterToggle = () => {
    onToggleAll(!allActive);
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Student / Parent Mobile App Permissions</h3>
            <p className="text-xs text-ink-muted">Control accessible features on the student & guardian mobile app.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleMasterToggle}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-white/10 bg-surface-secondary text-xs font-bold hover:text-primary transition-all self-start sm:self-auto"
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>{allActive ? 'Deselect All' : 'Select All'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PERMISSION_KEYS.map((perm) => {
          const isEnabled = appSettings[perm.key] !== false;
          return (
            <div
              key={perm.key}
              onClick={() => onToggleSetting(perm.key)}
              className="flex items-center justify-between p-3 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary/40 cursor-pointer transition-colors select-none"
            >
              <span className="text-xs font-semibold text-ink dark:text-ink-dark">{perm.label}</span>
              <div
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                  isEnabled ? 'bg-primary' : 'bg-line dark:bg-white/10'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    isEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentAppSettingsTab;
