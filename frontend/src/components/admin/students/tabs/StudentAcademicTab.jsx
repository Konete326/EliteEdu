import { GraduationCap, Award, FileCheck } from 'lucide-react';

const StudentAcademicTab = ({ formData, onNestedChange }) => {
  const academic = formData.academic_history || {};
  const test = formData.admission_test || {};
  const interview = formData.admission_interview || {};

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
          <GraduationCap className="w-4 h-4 text-primary" />
          <span>Previous Academic Record & Background</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Last Institute Attended
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
              Previous School Name
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
              Previous Student ID / Roll No.
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
              Last Class Completed
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
              Last Academic Session
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
              Last Examination Result / Grade
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

      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
          <FileCheck className="w-4 h-4 text-primary" />
          <span>Admission Test & Evaluation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Test Date
            </label>
            <input
              type="date"
              value={test.test_date ? new Date(test.test_date).toISOString().split('T')[0] : ''}
              onChange={(e) => onNestedChange('admission_test', 'test_date', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Test Status
            </label>
            <select
              value={test.status || 'Pending'}
              onChange={(e) => onNestedChange('admission_test', 'status', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
              <option value="Exempted">Exempted</option>
            </select>
          </div>

          <div className="flex items-center gap-4 pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(test.test_passed)}
                onChange={(e) => onNestedChange('admission_test', 'test_passed', e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-line"
              />
              <span className="font-semibold text-ink dark:text-ink-dark">Test Passed</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(test.payment_received)}
                onChange={(e) => onNestedChange('admission_test', 'payment_received', e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-line"
              />
              <span className="font-semibold text-ink dark:text-ink-dark">Fee Received</span>
            </label>
          </div>

          <div className="md:col-span-3">
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Admission Test Remarks
            </label>
            <input
              type="text"
              value={test.remarks || ''}
              onChange={(e) => onNestedChange('admission_test', 'remarks', e.target.value)}
              placeholder="e.g. Scored 45/50 in Math and English, recommended for Section A"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
          <Award className="w-4 h-4 text-primary" />
          <span>Admission Interview</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Interview Date
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
              Interview Status
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
              Interview Remarks / Observations
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
    </div>
  );
};

export default StudentAcademicTab;
