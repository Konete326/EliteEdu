import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import api from '../../../services/api';

const EditSalarySlipModal = ({ slip, isOpen, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    house_rent_allowance: 0, medical_allowance: 0, conveyance_allowance: 0, bonus_or_encashment: 0,
    absent_deduction: 0, loan_deduction: 0, deposit_deduction: 0, other_deduction: 0, remarks: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (slip) {
      setFormData({
        house_rent_allowance: slip.house_rent_allowance || 0, medical_allowance: slip.medical_allowance || 0,
        conveyance_allowance: slip.conveyance_allowance || 0, bonus_or_encashment: slip.bonus_or_encashment || 0,
        absent_deduction: slip.absent_deduction || 0, loan_deduction: slip.loan_deduction || 0,
        deposit_deduction: slip.deposit_deduction || 0, other_deduction: slip.other_deduction || 0,
        remarks: slip.remarks || ''
      });
    }
  }, [slip]);

  if (!isOpen || !slip) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'remarks' ? value : Number(value) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const basic = Number(slip.basic_salary || 0);
      const totalAllow = formData.house_rent_allowance + formData.medical_allowance + formData.conveyance_allowance + formData.bonus_or_encashment;
      const totalDed = formData.absent_deduction + formData.loan_deduction + formData.deposit_deduction + formData.other_deduction;
      const net = Math.max(0, basic + totalAllow - totalDed);

      await api.put(`/payroll/slips/${slip._id}`, { ...formData, total_allowances: totalAllow, total_deductions: totalDed, net_payable: net });
      onUpdated();
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-surface dark:bg-surface-dark rounded-2xl border border-line shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-line">
          <h3 className="text-sm font-black text-ink dark:text-ink-dark">Adjust Payslip Allowances & Deductions</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-secondary text-ink-muted"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-surface-secondary/40 border border-line flex items-center justify-between font-bold">
            <span className="text-ink-muted">Basic Salary:</span>
            <span className="font-mono text-ink text-sm">PKR {Number(slip.basic_salary || 0).toLocaleString()}</span>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-emerald-600 uppercase text-[10px] tracking-wider">Allowances (PKR)</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-ink-muted mb-1">House Rent</label>
                <input type="number" name="house_rent_allowance" value={formData.house_rent_allowance} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-mono font-bold outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink-muted mb-1">Medical</label>
                <input type="number" name="medical_allowance" value={formData.medical_allowance} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-mono font-bold outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink-muted mb-1">Conveyance</label>
                <input type="number" name="conveyance_allowance" value={formData.conveyance_allowance} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-mono font-bold outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink-muted mb-1">Bonus / Extra</label>
                <input type="number" name="bonus_or_encashment" value={formData.bonus_or_encashment} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-mono font-bold outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-rose-600 uppercase text-[10px] tracking-wider">Deductions (PKR)</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-ink-muted mb-1">Absent Deductions</label>
                <input type="number" name="absent_deduction" value={formData.absent_deduction} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-mono font-bold outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink-muted mb-1">Other Penalties / Deductions</label>
                <input type="number" name="other_deduction" value={formData.other_deduction} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-mono font-bold outline-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-md shadow-primary/20">
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Update Slip Calculations'}</span>
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-line text-ink-muted hover:text-ink font-bold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSalarySlipModal;
