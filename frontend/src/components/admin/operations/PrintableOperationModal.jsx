import { useRef } from 'react';
import { X, Printer, FileText, Scissors } from 'lucide-react';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const PrintableOperationModal = ({ record, isOpen, onClose }) => {
  const printRef = useRef(null);
  if (!isOpen || !record) return null;
  const isConsent = record.category === 'Consent_Letter' || record.record_type === 'Parental_Consent';
  const recDate = record.event_date || record.event_Or_due_date || record.createdAt;
  const formattedDate = recDate ? new Date(recDate).toLocaleDateString() : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-dark rounded-2xl border border-line shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-line print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black text-ink dark:text-ink-dark">
              {isConsent ? 'Parental Consent & Permission Letter' : `Official Record (${(record.category || record.record_type || '').replace('_', ' ')})`}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Slip</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-secondary text-ink-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={printRef} className="p-6 overflow-y-auto print:p-0 space-y-4 text-ink dark:text-ink-dark text-xs">
          <div className="flex items-start justify-between border-b-2 border-line pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary text-white text-[10px] font-black tracking-wider">ELITE EDU</span>
                <h1 className="text-base font-black tracking-tight text-ink">ELITE EDUCATION SYSTEM</h1>
              </div>
              <p className="font-semibold text-ink-muted text-[11px]">Campus Operations & Student Welfare Secretariat</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                {(record.category || record.record_type || '').replace('_', ' ')}
              </span>
              <p className="text-[10px] text-ink-muted mt-0.5 font-mono">Date: {formattedDate}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary/40 border border-line space-y-1.5">
            <div className="flex justify-between font-bold">
              <span className="text-ink-muted text-xs">Subject / Purpose:</span>
              <span className="text-ink">{record.title}</span>
            </div>
            {record.student_id && (
              <div className="flex justify-between text-xs pt-1 border-t border-line">
                <span className="text-ink-muted">Student:</span>
                <span className="font-bold text-ink">{record.student_id.name} ({record.student_id.roll_number || record.student_id.admission_number || 'N/A'})</span>
              </div>
            )}
            {record.item_location_or_fee && (
              <div className="flex justify-between text-xs">
                <span className="text-ink-muted">Location / Charges:</span>
                <span className="font-semibold text-ink">{record.item_location_or_fee}</span>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-line space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-muted block">{isConsent ? 'Official Consent Notice / Details:' : 'Case & Action Notes:'}</span>
            <p className="font-medium text-ink leading-relaxed whitespace-pre-wrap">{record.details || record.description || 'No detailed remarks recorded.'}</p>
          </div>

          <div className="pt-2">
            <OfficialSignatureStampBlock signatureTitle="Authorizing Authority" stampTitle="Institutional Affairs Stamp" compact={true} />
          </div>

          {isConsent && (
            <div className="pt-3 border-t-2 border-dashed border-line space-y-3">
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-ink-muted uppercase tracking-wider">
                <Scissors className="w-3.5 h-3.5" />
                <span>Cut Here • Tear-off Parent Acknowledgment & Consent Slip</span>
              </div>
              <div className="p-3 rounded-xl border border-line bg-surface-secondary/20 space-y-2 text-[11px]">
                <p className="font-bold text-ink">I, Parent / Guardian of <span className="underline decoration-dotted">{record.student_id?.name || '________________'}</span>, have read the notice regarding &quot;{record.title}&quot;.</p>
                <div className="flex items-center gap-6 py-1">
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer"><input type="checkbox" className="rounded" /> [ ] I give full consent</label>
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer"><input type="checkbox" className="rounded" /> [ ] I do NOT consent</label>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-line/60 text-[10px]">
                  <div><span className="text-ink-muted block">Parent Signature:</span><div className="h-5 border-b border-line mt-1"></div></div>
                  <div><span className="text-ink-muted block">Emergency Phone:</span><div className="h-5 border-b border-line mt-1"></div></div>
                  <div><span className="text-ink-muted block">Date of Submission:</span><div className="h-5 border-b border-line mt-1"></div></div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-line text-center text-[9px] text-ink-muted flex items-center justify-between">
            <span>EliteEdu School ERP • Operations Management Module</span>
            <span>Ref: {record._id ? String(record._id).slice(-8).toUpperCase() : 'EE-OP'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableOperationModal;
