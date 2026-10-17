import React from 'react';
import { X, Printer, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';

const LeaveSlipModal = ({ leave, isOpen, onClose }) => {
  if (!isOpen || !leave) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs print:p-0 print:bg-white">
      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-w-none">
        <div className="flex items-center justify-between p-4 border-b border-line dark:border-line-dark print:hidden">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            <h3 className="font-bold text-sm text-ink dark:text-white">Official Leave Certificate / Slip</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer">
              <Printer size={13} /> Print Slip
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl border border-line hover:bg-surface-secondary text-ink-muted cursor-pointer">
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 print:p-8">
          <div className="text-center pb-3 border-b border-line dark:border-line-dark">
            <h2 className="text-base font-black uppercase text-ink dark:text-white tracking-wide">ELITE EDUCATIONAL SYSTEM</h2>
            <p className="text-[11px] font-semibold text-ink-muted">Official Attendance & Leave Management Division</p>
            <div className="inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary">
              APPROVED LEAVE VOUCHER
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-surface-secondary/40 dark:bg-white/[0.02] p-3 rounded-xl border border-line dark:border-line-dark">
            <div>
              <span className="text-[10px] text-ink-muted font-bold block uppercase">Applicant</span>
              <span className="font-bold text-ink dark:text-white">{leave.applicant_type === 'Student' ? leave.student_id?.name : leave.staff_id?.name}</span>
              <span className="text-[10px] text-ink-muted block">{leave.applicant_type === 'Student' ? `Class: ${leave.grade_id?.name || '—'} (${leave.section}) • GR: ${leave.student_id?.gr_number || '—'}` : `Designation: ${leave.staff_id?.designation || 'Staff'} • Code: ${leave.staff_id?.employee_code || '—'}`}</span>
            </div>
            <div>
              <span className="text-[10px] text-ink-muted font-bold block uppercase">Leave Type</span>
              <span className="font-bold text-primary">{leave.leave_type}</span>
              <span className="text-[10px] text-ink-muted block">Duration: {leave.total_days} Day(s)</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-line dark:border-line-dark">
              <span className="text-ink-muted">Leave Duration:</span>
              <span className="font-bold text-ink dark:text-white font-mono">{leave.from_date} to {leave.to_date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-line dark:border-line-dark">
              <span className="text-ink-muted">Status:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> {leave.status}</span>
            </div>
            <div className="py-1">
              <span className="text-ink-muted block text-[11px] font-semibold">Reason stated:</span>
              <p className="mt-1 p-2 rounded-lg bg-surface-secondary/50 dark:bg-white/[0.03] text-ink dark:text-white italic text-[11px]">{leave.reason}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-line dark:border-line-dark flex items-center justify-between">
            <OfficialSignatureStampBlock />
            <div className="text-right text-[9px] font-mono text-ink-muted">
              <div>Ref: {String(leave._id).slice(-8).toUpperCase()}</div>
              <div>Generated via EliteEdu</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveSlipModal;
