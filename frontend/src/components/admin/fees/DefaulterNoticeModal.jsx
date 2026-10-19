import { X, Printer, AlertTriangle } from 'lucide-react';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const DefaulterNoticeModal = ({ isOpen, onClose, defaulter, schoolName = 'ELITE EDUCATION SYSTEM' }) => {
  if (!isOpen || !defaulter) return null;

  const student = defaulter.student || {};
  const totalBalance = Number(defaulter.total_balance || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white text-slate-900 border border-slate-300 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-bold text-xs uppercase tracking-wider text-slate-900">Official Fee Defaulter Notice</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => window.print()} className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Printer className="w-3.5 h-3.5" />
              <span>Print Notice</span>
            </button>
            <button type="button" onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          <div className="text-center pb-3 border-b-2 border-slate-900">
            <h2 className="text-base font-black uppercase tracking-tight">{schoolName}</h2>
            <p className="text-[11px] text-slate-600">Finance & Accounts Department • Notice of Overdue Dues</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
            <div><span className="font-bold">Student Name:</span> <span className="font-bold uppercase">{student.name}</span></div>
            <div><span className="font-bold">GR Number:</span> <span className="font-mono font-bold">{student.gr_number}</span></div>
            <div><span className="font-bold">Father / Guardian:</span> {student.father_name}</div>
            <div><span className="font-bold">Class / Section:</span> {defaulter.grade?.name} ({defaulter.section || 'A'})</div>
            <div><span className="font-bold">Contact:</span> {student.contact_number || '—'}</div>
            <div><span className="font-bold">Notice Date:</span> {new Date().toLocaleDateString('en-GB')}</div>
          </div>

          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wide">Total Outstanding Arrears</span>
              <span className="font-mono text-base font-black text-red-600">PKR {totalBalance.toLocaleString()}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              This is to formally notify you that tuition and allied school dues have been overdue. You are requested to clear all pending dues immediately at the designated bank or institution fee counter to avoid suspension of academic portal services and class attendance.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-100 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-1.5 px-3">Challan #</th>
                  <th className="py-1.5 px-3">Billing Month</th>
                  <th className="py-1.5 px-3 text-right">Balance Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(defaulter.invoices || []).map((inv, idx) => (
                  <tr key={idx}>
                    <td className="py-1.5 px-3 font-mono font-bold">{inv.challan_no}</td>
                    <td className="py-1.5 px-3">{inv.billing_month}</td>
                    <td className="py-1.5 px-3 text-right font-mono font-bold text-red-600">Rs. {Number(inv.balance_due).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-300">
            <OfficialSignatureStampBlock signatureTitle="Accounts Incharge" stampTitle="Institutional Stamp" compact={true} />
            <div className="text-[8px] text-slate-400 font-mono text-right pt-2 select-none">EliteEdu Automated Notice</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaulterNoticeModal;
