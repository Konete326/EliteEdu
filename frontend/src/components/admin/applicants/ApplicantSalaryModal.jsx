import { useState, useEffect } from 'react';
import { X, DollarSign, Check } from 'lucide-react';

const ApplicantSalaryModal = ({ isOpen, applicant, onClose, onConfirm }) => {
  const [salary, setSalary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (applicant) {
      setSalary(applicant.approved_salary || applicant.expected_salary || '');
    }
  }, [applicant]);

  if (!isOpen || !applicant) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onConfirm(applicant._id, 'Approved', Number(salary) || 0);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface dark:bg-[#141414] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink dark:text-ink-dark">Approve Salary</h3>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark">{applicant.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-surface-secondary/40 dark:bg-white/[0.02] border border-line/60 dark:border-white/5 space-y-1">
            <span className="text-[11px] text-ink-muted block">Expected Salary:</span>
            <span className="text-sm font-bold text-ink dark:text-ink-dark">
              {applicant.expected_salary ? `Rs. ${applicant.expected_salary.toLocaleString()}` : 'Not Specified'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
              Approved Monthly Salary (PKR) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 45000"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line dark:border-white/10 bg-surface-secondary/30 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-semibold focus:border-primary/60"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? 'Approving...' : 'Approve & Save'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicantSalaryModal;
