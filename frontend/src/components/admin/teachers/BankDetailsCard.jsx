import { CreditCard, Sparkles } from 'lucide-react';

const BankDetailsCard = ({ bankDetails = {}, staffName = '', onChange }) => {
  const handleUseStaffName = () => {
    if (staffName) {
      onChange('account_title', staffName);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-white/10">
        <CreditCard className="w-4 h-4 text-primary dark:text-primary-dark" />
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark uppercase tracking-wider">
          Payroll & Bank Account Details
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Bank Name
          </label>
          <input
            type="text"
            value={bankDetails.bank_name || ''}
            onChange={(e) => onChange('bank_name', e.target.value)}
            placeholder="e.g. Meezan Bank / HBL"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-surface dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-ink-sub dark:text-ink-sub-dark">
              Account Title
            </label>
            <button
              type="button"
              onClick={handleUseStaffName}
              className="text-[10px] text-primary dark:text-primary-dark font-medium hover:underline inline-flex items-center gap-0.5"
            >
              <Sparkles className="w-2.5 h-2.5" /> Use Staff Name
            </button>
          </div>
          <input
            type="text"
            value={bankDetails.account_title || ''}
            onChange={(e) => onChange('account_title', e.target.value)}
            placeholder="Account holder title"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-surface dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Account Number / IBAN
          </label>
          <input
            type="text"
            value={bankDetails.iban || bankDetails.account_number || ''}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              onChange('iban', val);
              onChange('account_number', val);
            }}
            placeholder="PK00MEZN0000000000000000"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-surface dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Branch Code
          </label>
          <input
            type="text"
            value={bankDetails.branch_code || ''}
            onChange={(e) => onChange('branch_code', e.target.value)}
            placeholder="e.g. 0102"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-surface dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary transition-all font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export default BankDetailsCard;
