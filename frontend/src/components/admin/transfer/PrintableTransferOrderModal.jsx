import { useRef } from 'react';
import { X, Printer, ArrowLeftRight } from 'lucide-react';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const PrintableTransferOrderModal = ({ transfer, isOpen, onClose }) => {
  const printRef = useRef(null);
  if (!isOpen || !transfer) return null;

  const s = transfer.student_id || {};
  const d = transfer.transfer_details || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-dark rounded-2xl border border-line shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-line print:hidden">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black text-ink dark:text-ink-dark">
              Official Campus Transfer Order ({d.transfer_order_no})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Order Slip</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-secondary text-ink-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={printRef} className="p-8 overflow-y-auto print:p-0 space-y-5 text-ink dark:text-ink-dark text-xs">
          <div className="flex items-start justify-between border-b-2 border-line pb-4">
            <div>
              <h1 className="text-xl font-black tracking-tight text-ink">ELITE EDUCATION SYSTEM</h1>
              <p className="font-semibold text-ink-muted">Central Directorate of Student Admissions & Campus Transfers</p>
              <p className="text-[10px] text-ink-muted font-bold mt-0.5">Official Inter-Branch Transfer Order</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                Transfer Approved
              </span>
              <p className="font-mono text-sm font-bold mt-1.5">{d.transfer_order_no}</p>
              <p className="text-[10px] text-ink-muted">Effective: {d.effective_date ? new Date(d.effective_date).toLocaleDateString() : 'Immediate'}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-secondary/40 border border-line space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-[10px] uppercase font-bold text-ink-muted block">Student Name:</span><span className="font-bold text-ink text-sm">{s.name || 'Student'}</span></div>
              <div><span className="text-[10px] uppercase font-bold text-ink-muted block">Roll Number / ID:</span><span className="font-mono font-bold text-ink">{s.roll_number || 'N/A'}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface border border-line space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-rose-600 block">Originating Branch</span>
              <p className="font-bold text-ink text-sm">{d.from_campus_id?.name || 'Main Campus'}</p>
              <p className="text-ink-muted">Class: {d.from_grade_id?.name || 'Grade'} - {d.from_section || 'A'}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-line space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">Destination Branch</span>
              <p className="font-bold text-ink text-sm">{d.to_campus_id?.name || 'Branch Campus'}</p>
              <p className="text-ink-muted">Class: {d.to_grade_id?.name || 'Grade'} - {d.to_section || 'A'}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-secondary/30 border border-line space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">Transfer Justification / Reason:</span>
            <p className="font-semibold text-ink">{d.reason || 'Official transfer granted by Academic Administration.'}</p>
          </div>

          <div className="pt-4">
            <OfficialSignatureStampBlock signatureTitle="Director Campus Admissions" stampTitle="Institutional Seal" />
          </div>

          <div className="pt-2 border-t border-line text-center text-[9px] text-ink-muted flex items-center justify-between">
            <span>EliteEdu Campus Relocation Protocol • Copy to Accounts & Both Campuses</span>
            <span>Issued on: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableTransferOrderModal;
