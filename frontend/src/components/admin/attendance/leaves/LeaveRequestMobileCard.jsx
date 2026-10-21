import React from 'react';
import { Check, X, Printer, Trash2, User, GraduationCap, MessageCircle, Calendar } from 'lucide-react';

const LeaveRequestMobileCard = ({
  leave,
  onApprove,
  onReject,
  onPrint,
  onDelete,
  onWhatsApp,
  isProcessing
}) => {
  const isStudent = leave.applicant_type === 'Student';
  const name = isStudent ? leave.student_id?.name : leave.staff_id?.name;
  const photo = isStudent ? leave.student_id?.photo_url : leave.staff_id?.photo_url;
  const sub = isStudent
    ? `Class: ${leave.grade_id?.name || '—'} (${leave.section || 'A'}) • GR: ${leave.student_id?.gr_number || '—'}`
    : `${leave.staff_id?.designation || 'Staff'} • Code: ${leave.staff_id?.employee_code || '—'}`;

  const statusStyles = {
    Pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    Approved: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    Rejected: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  };

  const handleWhatsApp = () => {
    if (onWhatsApp) {
      onWhatsApp(leave);
      return;
    }
    const rawPhone = isStudent
      ? (leave.student_id?.contact_number || leave.student_id?.emergency_contact_no || '')
      : (leave.staff_id?.phone || leave.staff_id?.contact_number || '');
    let cleanPhone = String(rawPhone).replace(/[^0-9]/g, '');
    if (!cleanPhone) return;
    if (cleanPhone.startsWith('0')) cleanPhone = '92' + cleanPhone.slice(1);
    const text = `Assalam-o-Alaikum ${name || 'Applicant'},\n\nYour Leave Application (${leave.leave_type}) from ${leave.from_date} to ${leave.to_date} (${leave.total_days} Day(s)) is: ${leave.status.toUpperCase()}.\nReason: ${leave.reason}\n\nElite Educational Institution`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-3">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {photo ? (
            <img src={photo} alt={name} className="w-10 h-10 rounded-full object-cover border border-line shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {isStudent ? <GraduationCap size={16} /> : <User size={16} />}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-ink dark:text-white truncate">{name || 'Unnamed'}</h4>
            <p className="text-[10px] text-ink-muted truncate">{sub}</p>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${statusStyles[leave.status] || 'bg-slate-100'}`}>
          {leave.status}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-line/60 dark:border-line-dark/60 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-secondary text-ink border border-line">
            {leave.leave_type}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
            {leave.total_days} Day(s)
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-ink-muted shrink-0">
          <Calendar size={11} className="text-primary shrink-0" />
          <span>{leave.from_date}</span>
          <span>→</span>
          <span>{leave.to_date}</span>
        </div>
      </div>

      {leave.reason && (
        <div className="p-2 rounded-xl bg-surface-secondary/50 dark:bg-white/[0.02] border border-line/50 dark:border-line-dark/50 text-[11px] text-ink-muted leading-relaxed line-clamp-2">
          {leave.reason}
        </div>
      )}

      <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-line/60 dark:border-line-dark/60">
        <div className="flex items-center gap-1.5">
          {leave.status === 'Pending' && (
            <>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onApprove(leave)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <Check size={12} />
                <span>Approve</span>
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onReject(leave)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white text-[11px] font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <X size={12} />
                <span>Reject</span>
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="p-1.5 rounded-xl border border-line hover:bg-emerald-500/10 hover:text-emerald-600 text-ink-muted transition-colors cursor-pointer"
            title="WhatsApp Notification"
          >
            <MessageCircle size={13} />
          </button>
          <button
            type="button"
            onClick={() => onPrint(leave)}
            className="p-1.5 rounded-xl border border-line hover:bg-surface-secondary text-ink-muted transition-colors cursor-pointer"
            title="Print Leave Slip"
          >
            <Printer size={13} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(leave)}
            className="p-1.5 rounded-xl border border-line hover:bg-rose-500/10 hover:text-rose-600 text-ink-muted transition-colors cursor-pointer"
            title="Delete Application"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestMobileCard;