import { createPortal } from 'react-dom';
import React from 'react';
import { X, Printer, FileSpreadsheet } from 'lucide-react';

const STATUS_LABELS = {
  P: { label: 'Present', color: 'text-emerald-600 bg-emerald-500/10' },
  A: { label: 'Absent', color: 'text-rose-600 bg-rose-500/10' },
  L: { label: 'Leave', color: 'text-sky-600 bg-sky-500/10' },
  SL: { label: 'Short Leave', color: 'text-cyan-600 bg-cyan-500/10' },
  Late: { label: 'Late', color: 'text-amber-600 bg-amber-500/10' },
  LT: { label: 'Late', color: 'text-amber-600 bg-amber-500/10' },
  H: { label: 'Holiday', color: 'text-orange-600 bg-orange-500/10' },
  Hol: { label: 'Holiday', color: 'text-orange-600 bg-orange-500/10' },
  HD: { label: 'Half Day', color: 'text-purple-600 bg-purple-500/10' },
  Off: { label: 'Day Off', color: 'text-slate-600 bg-slate-500/10' },
  U: { label: 'Unmarked', color: 'text-slate-500 bg-slate-500/10' }
};

const StaffDailyReportModal = ({ isOpen, onClose, date, records = [], summary = {} }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const modalNode = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 print:hidden">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-5 border-b border-line dark:border-line-dark flex items-center justify-between bg-surface-secondary/30 dark:bg-surface-secondary-dark/30 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-ink-dark">
                Daily Staff Attendance Report
              </h3>
              <p className="text-xs text-ink-muted">Date: {date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 print:p-0">
          <div className="text-center space-y-1 pb-3 border-b border-line dark:border-line-dark">
            <h2 className="text-lg font-black text-ink dark:text-ink-dark tracking-wide uppercase">
              Staff Daily Attendance Sheet
            </h2>
            <p className="text-xs font-semibold text-ink-muted">Date: {date}</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <div className="text-[10px] font-bold text-emerald-600">PRESENT</div>
              <div className="text-base font-black text-emerald-700 dark:text-emerald-400">{summary.present || 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
              <div className="text-[10px] font-bold text-rose-600">ABSENT</div>
              <div className="text-base font-black text-rose-700 dark:text-rose-400">{summary.absent || 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-center">
              <div className="text-[10px] font-bold text-sky-600">LEAVE</div>
              <div className="text-base font-black text-sky-700 dark:text-sky-400">{summary.leave || 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
              <div className="text-[10px] font-bold text-cyan-600">SHORT</div>
              <div className="text-base font-black text-cyan-700 dark:text-cyan-400">{summary.shortLeave || 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <div className="text-[10px] font-bold text-amber-600">LATE</div>
              <div className="text-base font-black text-amber-700 dark:text-amber-400">{summary.late || 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
              <div className="text-[10px] font-bold text-orange-600">HOLIDAY</div>
              <div className="text-base font-black text-orange-700 dark:text-orange-400">{summary.holiday || 0}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-center">
              <div className="text-[10px] font-bold text-slate-600">UNMARKED</div>
              <div className="text-base font-black text-slate-700 dark:text-slate-400">{summary.unmarked || 0}</div>
            </div>
          </div>

          <div className="border border-line dark:border-line-dark rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-secondary/70 dark:bg-surface-secondary-dark/70 border-b border-line dark:border-line-dark text-[10px] uppercase font-bold text-ink-muted">
                  <th className="py-2.5 px-3 text-center w-12">S.No</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Father Name</th>
                  <th className="py-2.5 px-3">Time In</th>
                  <th className="py-2.5 px-3">Time Out</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-line-dark">
                {records.map((r, idx) => {
                  const conf = STATUS_LABELS[r.status] || { label: r.status, color: 'text-slate-600 bg-slate-100' };
                  return (
                    <tr key={r.staff._id || idx} className="hover:bg-surface-secondary/30">
                      <td className="py-2 px-3 text-center font-bold text-ink-muted">{idx + 1}</td>
                      <td className="py-2 px-3 font-semibold text-ink dark:text-ink-dark">
                        {r.staff.name}
                      </td>
                      <td className="py-2 px-3 text-ink-sub dark:text-ink-sub-dark">
                        {r.staff.father_name || '-'}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-ink-sub">
                        {r.check_in_time || '-'}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-ink-sub">
                        {r.check_out_time || '-'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${conf.color}`}>
                          {conf.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : null;
};

export default StaffDailyReportModal;
