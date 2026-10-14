import { useState } from 'react';
import { DollarSign, Plus, Trash2 } from 'lucide-react';
import BankDetailsCard from './BankDetailsCard';

const TeacherPayrollTab = ({ payrollConfig = {}, onPayrollChange, basicSalary = 0, onSalaryChange, bankDetails = {}, onBankChange, staffName = '' }) => {
  const [allowanceTitle, setAllowanceTitle] = useState('');
  const [allowanceAmount, setAllowanceAmount] = useState('');

  const allowances = payrollConfig.allowances || [];

  const handleAddAllowance = () => {
    if (!allowanceTitle.trim() || !allowanceAmount) return;
    onPayrollChange({
      ...payrollConfig,
      allowances: [...allowances, { title: allowanceTitle.trim(), amount: Number(allowanceAmount), type: 'Fixed' }]
    });
    setAllowanceTitle('');
    setAllowanceAmount('');
  };

  const handleRemoveAllowance = (idx) => {
    onPayrollChange({
      ...payrollConfig,
      allowances: allowances.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 space-y-6">
        <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
            <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Salary Structure</h3>
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Basic Salary (PKR) *</label>
            <input
              type="number"
              value={basicSalary || ''}
              onChange={(e) => onSalaryChange(Number(e.target.value) || 0)}
              placeholder="e.g. 50000"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-sm font-bold text-ink dark:text-ink-dark outline-none"
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-ink dark:text-ink-dark pb-2 border-b border-line dark:border-line-dark">Allowances</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={allowanceTitle}
              onChange={(e) => setAllowanceTitle(e.target.value)}
              placeholder="Allowance Title (e.g. Medical)"
              className="flex-1 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs outline-none"
            />
            <input
              type="number"
              value={allowanceAmount}
              onChange={(e) => setAllowanceAmount(e.target.value)}
              placeholder="Amount"
              className="w-24 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs outline-none"
            />
            <button type="button" onClick={handleAddAllowance} className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-1.5">
            {allowances.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-surface-secondary/40 text-xs">
                <span className="font-semibold">{a.title}</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-600">+PKR {a.amount}</span>
                  <button type="button" onClick={() => handleRemoveAllowance(i)} className="text-bad"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <BankDetailsCard bankDetails={bankDetails} staffName={staffName} onChange={onBankChange} />
      </div>
    </div>
  );
};

export default TeacherPayrollTab;
