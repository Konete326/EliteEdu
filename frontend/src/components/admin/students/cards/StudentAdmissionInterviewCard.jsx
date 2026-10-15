import { Award } from 'lucide-react';

const StudentAdmissionInterviewCard = ({ interview = {}, onNestedChange }) => {
  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
      <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
        <Award className="w-4 h-4 text-primary" />
        <span>Admission Interview</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Interview Date (Optional)
          </label>
          <input
            type="date"
            value={interview.interview_date ? new Date(interview.interview_date).toISOString().split('T')[0] : ''}
            onChange={(e) => onNestedChange('admission_interview', 'interview_date', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Interview Status (Optional)
          </label>
          <select
            value={interview.status || 'Pending'}
            onChange={(e) => onNestedChange('admission_interview', 'status', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          >
            <option value="Pending">Pending</option>
            <option value="Passed">Passed / Cleared</option>
            <option value="Failed">Failed</option>
            <option value="Exempted">Exempted</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Interview Remarks / Observations (Optional)
          </label>
          <input
            type="text"
            value={interview.remarks || ''}
            onChange={(e) => onNestedChange('admission_interview', 'remarks', e.target.value)}
            placeholder="e.g. Confident, fluent in communication, supportive parents"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentAdmissionInterviewCard;
