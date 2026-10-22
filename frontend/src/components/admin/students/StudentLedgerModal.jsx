import { X, FileText, CheckCircle, CreditCard } from 'lucide-react';

const StudentLedgerModal = ({ isOpen, student, onClose }) => {
  if (!isOpen || !student) return null;

  const fee = student.monthly_fee || 0;
  const discount = student.discount || 0;
  const netFee = Math.max(0, fee - discount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-dark">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink dark:text-white">Student Fee Ledger</h3>
              <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                {student.name} • GR #{student.gr_number}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white hover:bg-surface-secondary dark:hover:bg-[#1a1a1a] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 text-center">
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">Gross Monthly Fee</p>
            <p className="text-base font-bold text-ink dark:text-white mt-1">Rs. {fee.toLocaleString()}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 text-center">
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">Fee Concession</p>
            <p className="text-base font-bold text-warn mt-1">Rs. {discount.toLocaleString()}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10 text-center">
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">Net Monthly Due</p>
            <p className="text-base font-bold text-primary dark:text-primary-dark mt-1">Rs. {netFee.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-ink-muted-dark">Ledger Summary</h4>
          <div className="p-4 rounded-xl bg-surface-secondary/50 dark:bg-[#141414] border border-line dark:border-white/10 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-muted dark:text-ink-muted-dark">Enrolled Grade:</span>
              <span className="font-semibold text-ink dark:text-white">{student.current_grade?.name || 'Class'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted dark:text-ink-muted-dark">Section:</span>
              <span className="font-semibold text-ink dark:text-white">{student.current_section || 'A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted dark:text-ink-muted-dark">Admission Date:</span>
              <span className="font-semibold text-ink dark:text-white">
                {student.admission_date ? new Date(student.admission_date).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted dark:text-ink-muted-dark">Billing Cycle:</span>
              <span className="font-semibold text-good dark:text-good-dark flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 1st of every month
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold hover:bg-surface-secondary dark:hover:bg-[#1a1a1a] text-ink dark:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentLedgerModal;
