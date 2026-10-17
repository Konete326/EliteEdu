import { Sparkles } from 'lucide-react';

const TEMPLATES = [
  {
    label: 'Staff Meeting',
    title: 'Staff Coordination Meeting',
    message: 'All faculty members are requested to gather in the main auditorium at 02:00 PM today.',
    type: 'Announcement',
    priority: 'Important',
    target_audience: 'Teachers'
  },
  {
    label: 'Exam Deadline',
    title: 'Final Examination Marks Submission',
    message: 'Subject teachers are reminded that midterm exam grade entries close this Friday at 05:00 PM.',
    type: 'Academic',
    priority: 'Urgent',
    target_audience: 'Teachers'
  },
  {
    label: 'Attendance Alert',
    title: 'Daily Student Attendance Due',
    message: 'Please complete and lock the morning attendance sheet before second period ends.',
    type: 'Attendance',
    priority: 'Normal',
    target_audience: 'Teachers'
  },
  {
    label: 'Holiday Notice',
    title: 'Institutional Public Holiday',
    message: 'Campus operations and academic sessions will remain suspended tomorrow on account of public holiday.',
    type: 'Announcement',
    priority: 'Normal',
    target_audience: 'All'
  }
];

const NotificationTemplatesBar = ({ onSelectTemplate }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-muted">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span>Quick Broadcast Templates:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {TEMPLATES.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => onSelectTemplate(t)}
            className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-surface-secondary dark:bg-white/5 border border-line dark:border-white/10 text-ink dark:text-ink-dark hover:border-primary/50 transition-colors cursor-pointer"
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationTemplatesBar;
