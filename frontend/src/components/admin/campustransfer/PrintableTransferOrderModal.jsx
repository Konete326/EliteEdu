import { Printer, X } from 'lucide-react';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const PrintableTransferOrderModal = ({ transfer, isOpen, onClose }) => {
  if (!isOpen || !transfer) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:p-0 print:bg-white animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white text-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 print:border-none print:shadow-none print:p-6 print:w-full space-y-6">
        <div className="flex items-start justify-between border-b pb-4 border-slate-200 print:hidden">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Official Transfer Order</h3>
            <p className="text-xs text-slate-500">A4 Clearance Certificate & NOC</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 NOC</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 mb-1">
            <img src="/logo.png" alt="EliteEdu" className="w-8 h-8 object-contain" />
            <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">EliteEdu School Network</h2>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Central Directorate of Admissions & Institutional Transfers</p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-300">
              Official Branch Transfer Order & NOC
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono border-y border-slate-200 py-2 text-slate-600">
          <span>Order No: <strong className="text-slate-900">{transfer.transfer_no}</strong></span>
          <span>Date: <strong className="text-slate-900">{transfer.transfer_date ? new Date(transfer.transfer_date).toLocaleDateString() : 'N/A'}</strong></span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <p className="text-[10px] uppercase font-bold text-slate-400">Candidate Information</p>
            <p className="text-sm font-extrabold text-slate-900">{transfer.person_name}</p>
            <p className="text-[11px] text-slate-600">Identification Code: <strong className="font-mono">{transfer.identifier_code || 'N/A'}</strong></p>
            <p className="text-[11px] text-slate-600">Affiliation: <strong>{transfer.entity_type}</strong></p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <p className="text-[10px] uppercase font-bold text-slate-400">Reallocation Matrix</p>
            <p className="text-[11px] text-slate-600">Origin Branch: <strong className="text-slate-900">{transfer.from_campus_name || 'Main Branch'}</strong></p>
            <p className="text-[11px] text-slate-600">Destination Branch: <strong className="text-slate-900 text-emerald-700">{transfer.to_campus_name}</strong></p>
            <p className="text-[11px] text-slate-600">Assigned Class / Role: <strong>{transfer.to_class_or_role || transfer.from_class_or_role || 'Standard'}</strong></p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400">Administrative Directive & Reason</p>
          <p className="text-slate-700 italic leading-relaxed">&ldquo;{transfer.reason || 'Official inter-campus transfer approved by competent authority.'}&rdquo;</p>
          {transfer.entity_type === 'Student' && (
            <p className="text-[11px] text-slate-500 pt-1">
              Financial Status: All pending dues and active challans transferred to {transfer.to_campus_name} accounts registry.
            </p>
          )}
        </div>

        <div className="pt-4">
          <OfficialSignatureStampBlock signatureTitle="Director Campus Admissions" stampTitle="Institutional Seal" />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-[10px] text-slate-400">
          <span>Official System Generated Clearance Voucher</span>
          <span className="font-bold text-slate-600">EliteEdu ERP</span>
        </div>
      </div>
    </div>
  );
};

export default PrintableTransferOrderModal;
