import React from 'react';
import { Check, X, Printer, Trash2, User, GraduationCap, MessageCircle } from 'lucide-react';

const LeaveRequestRow = ({
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
  const sub = isStudent ? `Class: ${leave.grade_id?.name || '—'} (${leave.section || 'A'}) • GR: ${leave.student_id?.gr_number || '—'}` : `${leave.staff_id?.designation || 'Staff'} • Code: ${leave.staff_id?.employee_code || '—'}`;

  const statusStyles = {
    Pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    Approved: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    Rejected: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  };

  const handleWhatsAppClick = () => {
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
    <tr className="hover:bg-surface-secondary/40 transition-colors">
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2.5">
          {photo ? (
            <img src={photo} alt={name} className="w-8 h-8 rounded-full object-cover border border-line" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {isStudent ? <GraduationCap size={14} /> : <User size={14} />}
            </div>
          )}
          <div>
            <div className="font-bold text-xs text-ink dark:text-white">{name || 'Unnamed'}</div>
            <div className="text-[10px] text-ink-muted">{sub}</div>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-3">
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-secondary text-ink border border-line">
          {leave.leave_type}
        </span>
      </td>
      <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap">
        <div>{leave.from_date} <span className="text-ink-muted">to</span> {leave.to_date}</div>
        <span className="text-[10px] font-bold text-primary font-sans">{leave.total_days} Day(s)</span>
      </td>
      <td className="py-2.5 px-3 max-w-[200px] truncate text-xs text-ink-muted" title={leave.reason}>
        {leave.reason}
      </td>
      <td className="py-2.5 px-3">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block ${statusStyles[leave.status] || 'bg-slate-100'}`}>
          {leave.status}
        </span>
      </td>
      <td className="py-2.5 px-3 text-right">
        <div className="flex items-center justify-end gap-1">
          {leave.status === 'Pending' && (
            <>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onApprove(leave)}
                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                title="Approve & Sync Attendance"
              >
                <Check size={13} />
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => onReject(leave)}
                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                title="Reject Application"
              >
                <X size={13} />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="p-1.5 rounded-lg border border-line hover:bg-emerald-500/10 hover:text-emerald-600 text-ink-muted transition-colors cursor-pointer"
            title="Notify via WhatsApp"
          >
            <MessageCircle size={13} />
          </button>
          <button
            type="button"
            onClick={() => onPrint(leave)}
            className="p-1.5 rounded-lg border border-line hover:bg-surface-secondary text-ink-muted cursor-pointer"
            title="Print Leave Slip"
          >
            <Printer size={13} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(leave)}
            className="p-1.5 rounded-lg border border-line hover:bg-rose-50 hover:text-rose-600 text-ink-muted cursor-pointer"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LeaveRequestRow;
