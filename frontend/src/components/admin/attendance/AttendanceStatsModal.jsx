import React, { useEffect } from 'react';
import { X, BarChart3, CheckCircle2, XCircle, Clock, AlertCircle, Percent } from 'lucide-react';

const AttendanceStatsModal = ({ isOpen, onClose, summary = {}, classLabel = 'Selected Class', date }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const total = summary.total || 0;
  const present = summary.present || 0;
  const absent = summary.absent || 0;
  const leave = summary.leave || 0;
  const late = summary.late || 0;
  const halfDay = summary.halfDay || 0;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-3xl p-6 shadow-2xl z-10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink dark:text-ink-dark">Attendance Analytics</h3>
              <p className="text-xs text-ink-muted font-medium">{classLabel} • {date}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-primary">Class Attendance Rate</p>
            <h4 className="text-2xl font-black text-ink dark:text-ink-dark mt-0.5">{rate}%</h4>
            <p className="text-[11px] text-ink-muted mt-0.5">{present} out of {total} students present</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark flex items-center justify-center text-primary font-black text-sm shadow-2xs">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-muted">Present</p>
              <p className="text-base font-bold text-ink dark:text-ink-dark">{present}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-muted">Absent</p>
              <p className="text-base font-bold text-ink dark:text-ink-dark">{absent}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-muted">Leave / Approved</p>
              <p className="text-base font-bold text-ink dark:text-ink-dark">{leave}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-muted">Late / Half Day</p>
              <p className="text-base font-bold text-ink dark:text-ink-dark">{late + halfDay}</p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white transition-all shadow-xs cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStatsModal;
