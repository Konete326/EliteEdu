import React from 'react';
import { Loader2, Users } from 'lucide-react';
import StudentAttendanceSheetTable from './StudentAttendanceSheetTable';

const StudentAttendanceContentCard = ({
  loaded,
  loading,
  records = [],
  summary = {},
  onStatusChange,
  onRemarksChange
}) => {
  const total = summary.total || records.length || 0;
  const present = summary.present || 0;
  const absent = summary.absent || 0;
  const leave = summary.leave || 0;
  const late = summary.late || 0;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-[460px]">
      {!loaded ? (
        <div className="flex-1 p-16 flex items-center justify-center text-center">
          <p className="text-xs sm:text-sm font-medium text-ink-muted dark:text-ink-muted">
            Select a class and date, then click <strong className="font-bold text-ink dark:text-ink-dark">Show</strong> to load students.
          </p>
        </div>
      ) : loading ? (
        <div className="flex-1 p-16 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
          <p className="text-xs font-semibold text-ink-muted">
            Loading student attendance records...
          </p>
        </div>
      ) : records.length === 0 ? (
        <div className="flex-1 p-16 flex flex-col items-center justify-center gap-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-surface-secondary dark:bg-surface-secondary-dark flex items-center justify-center text-ink-muted">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-ink dark:text-ink-dark">No Students Found</h4>
          <p className="text-xs text-ink-muted max-w-sm">
            There are no active enrolled students matching this class and section filter.
          </p>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <StudentAttendanceSheetTable
              records={records}
              onStatusChange={onStatusChange}
              onRemarksChange={onRemarksChange}
            />
          </div>

          <div className="p-4 border-t border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-surface-secondary-dark/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 flex-wrap font-semibold">
              <span className="text-ink-muted">
                Total Enrolled: <strong className="text-ink dark:text-ink-dark font-bold">{total}</strong>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                Present: {present}
              </span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                Absent: {absent}
              </span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">
                Leave: {leave}
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                Late: {late}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-ink-muted font-medium">Turnout:</span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                rate >= 80
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : rate >= 60
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}>
                {rate}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendanceContentCard;
