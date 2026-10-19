const ProfileBankDetailsCard = ({ bank = {}, onChange }) => {
  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-6 shadow-xs space-y-5">
      <div>
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Bank & Disbursement Particulars</h3>
        <p className="text-[11px] text-ink-muted">Account details for official payroll and reimbursement transfers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
            Bank Name
          </label>
          <input
            type="text"
            value={bank.bank_name || ''}
            onChange={(e) => onChange('bank_name', e.target.value)}
            placeholder="e.g. Meezan Bank / HBL"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
            Account Title
          </label>
          <input
            type="text"
            value={bank.account_title || ''}
            onChange={(e) => onChange('account_title', e.target.value)}
            placeholder="Account holder name"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
            Account # / IBAN
          </label>
          <input
            type="text"
            value={bank.iban || bank.account_number || ''}
            onChange={(e) => {
              onChange('iban', e.target.value);
              onChange('account_number', e.target.value);
            }}
            placeholder="PK00MEZN0000..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
            Branch Code
          </label>
          <input
            type="text"
            value={bank.branch_code || ''}
            onChange={(e) => onChange('branch_code', e.target.value)}
            placeholder="e.g. 0123"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileBankDetailsCard;
