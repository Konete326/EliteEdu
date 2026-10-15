import { GraduationCap } from 'lucide-react';

const StudentAcademicHistoryCard = ({ academic = {}, onNestedChange }) => {
  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
      <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
        <GraduationCap className="w-4 h-4 text-primary" />
        <span>Previous Academic Record & Background</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Last Institute Attended (Optional)
          </label>
          <input
            type="text"
            value={academic.last_institute || ''}
            onChange={(e) => onNestedChange('academic_history', 'last_institute', e.target.value)}
            placeholder="e.g. Army Public School"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Previous School Name (Optional)
          </label>
          <input
            type="text"
            value={academic.previous_school || ''}
            onChange={(e) => onNestedChange('academic_history', 'previous_school', e.target.value)}
            placeholder="e.g. Beaconhouse School System"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Previous Student ID / Roll No. (Optional)
          </label>
          <input
            type="text"
            value={academic.previous_id_roll_no || ''}
            onChange={(e) => onNestedChange('academic_history', 'previous_id_roll_no', e.target.value)}
            placeholder="e.g. 10293"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Last Class Completed (Optional)
          </label>
          <input
            type="text"
            value={academic.last_class || ''}
            onChange={(e) => onNestedChange('academic_history', 'last_class', e.target.value)}
            placeholder="e.g. Class 7"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Last Academic Session (Optional)
          </label>
          <input
            type="text"
            value={academic.last_session || ''}
            onChange={(e) => onNestedChange('academic_history', 'last_session', e.target.value)}
            placeholder="e.g. 2023 - 2024"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Last Examination Result / Grade (Optional)
          </label>
          <input
            type="text"
            value={academic.last_result || ''}
            onChange={(e) => onNestedChange('academic_history', 'last_result', e.target.value)}
            placeholder="e.g. 88% (A+ Grade)"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentAcademicHistoryCard;
