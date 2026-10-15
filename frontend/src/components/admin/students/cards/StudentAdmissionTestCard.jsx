import { FileCheck } from 'lucide-react';

const StudentAdmissionTestCard = ({ test = {}, onNestedChange }) => {
  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
      <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
        <FileCheck className="w-4 h-4 text-primary" />
        <span>Admission Test & Evaluation</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Test Date (Optional)
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
            Test Status (Optional)
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
            Admission Test Remarks (Optional)
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
  );
};

export default StudentAdmissionTestCard;
