import { DollarSign } from 'lucide-react';

const StudentFeeDiscountCard = ({ formData, onChange }) => {
  const netMonthly = Math.max(0, Number(formData.monthly_fee || 0) - Number(formData.discount || 0));

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
      <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
        <DollarSign className="w-4 h-4 text-primary" />
        <span>Fee & Tuition Structure</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Monthly Fee (PKR)
          </label>
          <input
            type="number"
            min="0"
            value={formData.monthly_fee || 0}
            onChange={(e) => onChange('monthly_fee', Number(e.target.value))}
            placeholder="e.g. 5000"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none font-bold"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Discount / Scholarship (PKR)
          </label>
          <input
            type="number"
            min="0"
            value={formData.discount || 0}
            onChange={(e) => onChange('discount', Number(e.target.value))}
            placeholder="e.g. 500"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-surface-secondary/80 dark:bg-[#141414] border border-line dark:border-white/10 flex flex-col justify-center">
          <span className="text-[11px] font-bold text-ink-muted uppercase">Net Monthly Receivable</span>
          <span className="text-base font-extrabold text-primary">
            Rs. {netMonthly.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeDiscountCard;
