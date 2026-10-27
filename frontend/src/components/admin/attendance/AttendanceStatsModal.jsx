import { createPortal } from 'react-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { X, BarChart3, CheckCircle2, XCircle, Clock, AlertCircle, Percent, Users, UserX, Loader2 } from 'lucide-react';
import api from '../../../services/api';

const AttendanceStatsModal = ({
  isOpen,
  onClose,
  summary = {},
  records = [],
  classLabel = 'Selected Class',
  date
}) => {
  const [institutionalStats, setInstitutionalStats] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && records.length === 0) {
      let isMounted = true;
      setLoadingRemote(true);
      api.get('/attendance/report/class-summary', { params: { date } })
        .then((res) => {
          if (isMounted && res.data?.success) {
            setInstitutionalStats(res.data);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoadingRemote(false);
        });
      return () => { isMounted = false; };
    }
  }, [isOpen, records.length, date]);

  const stats = useMemo(() => {
    if (records.length > 0) {
      const total = records.length;
      const present = records.filter((r) => r.status === 'P').length;
      const absent = records.filter((r) => r.status === 'A').length;
      const leave = records.filter((r) => r.status === 'L').length;
      const late = records.filter((r) => r.status === 'LT').length;
      const halfDay = records.filter((r) => r.status === 'HD').length;
      const rate = total > 0 ? Math.round((present / total) * 100) : 0;
      const absentStudents = records.filter((r) => r.status === 'A').map((r) => ({
        id: r.student?._id || r._id,
        name: r.student?.name || 'Student',
        roll: r.student?.roll_number || r.student?.gr_number || '—',
        remarks: r.remarks || 'Absent'
      }));
      const lateStudents = records.filter((r) => r.status === 'LT' || r.status === 'HD').map((r) => ({
        id: r.student?._id || r._id,
        name: r.student?.name || 'Student',
        roll: r.student?.roll_number || r.student?.gr_number || '—',
        status: r.status === 'HD' ? 'Half Day' : 'Late Arrival'
      }));

      return {
        total,
        present,
        absent,
        leave,
        late,
        halfDay,
        rate,
        absentStudents,
        lateStudents,
        isLiveClass: true
      };
    }

    if (institutionalStats?.kpis) {
      const k = institutionalStats.kpis;
      return {
        total: k.total_students || 0,
        present: k.present || 0,
        absent: k.absent || 0,
        leave: k.leave || 0,
        late: k.late || 0,
        halfDay: 0,
        rate: k.rate || 0,
        absentStudents: [],
        lateStudents: [],
        isLiveClass: false,
        classesCount: institutionalStats.classes?.length || 0
      };
    }

    const total = summary.total || 0;
    const present = summary.present || 0;
    const absent = summary.absent || 0;
    const leave = summary.leave || 0;
    const late = summary.late || 0;
    const halfDay = summary.halfDay || 0;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      total,
      present,
      absent,
      leave,
      late,
      halfDay,
      rate,
      absentStudents: [],
      lateStudents: [],
      isLiveClass: false
    };
  }, [records, institutionalStats, summary]);

  if (!isOpen) return null;

  const modalNode = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-3xl p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink dark:text-ink-dark">Attendance Analytics</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {stats.isLiveClass ? 'Live Session' : 'Campus Scope'}
                </span>
              </div>
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

        {loadingRemote ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-ink-muted">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs font-semibold">Fetching real-time attendance metrics...</span>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-primary">Attendance Efficiency Rate</p>
                  <h4 className="text-2xl font-black text-ink dark:text-ink-dark mt-0.5">{stats.rate}%</h4>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    {stats.present} of {stats.total} students present
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark flex items-center justify-center text-primary font-black text-sm shadow-2xs">
                  <Percent className="w-6 h-6" />
                </div>
              </div>
              <div className="w-full bg-surface dark:bg-surface-dark/80 rounded-full h-2 overflow-hidden border border-line dark:border-line-dark">
                <div
                  className="bg-primary h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, stats.rate))}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-center">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10px] font-semibold text-ink-muted uppercase">Present</p>
                <p className="text-base font-bold text-emerald-600">{stats.present}</p>
              </div>

              <div className="p-3 rounded-2xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-center">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto mb-1">
                  <XCircle className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10px] font-semibold text-ink-muted uppercase">Absent</p>
                <p className="text-base font-bold text-rose-600">{stats.absent}</p>
              </div>

              <div className="p-3 rounded-2xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-center">
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center mx-auto mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10px] font-semibold text-ink-muted uppercase">Leave</p>
                <p className="text-base font-bold text-sky-600">{stats.leave}</p>
              </div>

              <div className="p-3 rounded-2xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-center">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-1">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <p className="text-[10px] font-semibold text-ink-muted uppercase">Late / HD</p>
                <p className="text-base font-bold text-amber-600">{stats.late + stats.halfDay}</p>
              </div>
            </div>

            {stats.absentStudents.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-rose-600">
                  <span className="flex items-center gap-1">
                    <UserX className="w-3.5 h-3.5" />
                    <span>Students Marked Absent Today ({stats.absentStudents.length})</span>
                  </span>
                </div>
                <div className="max-h-36 overflow-y-auto rounded-xl border border-rose-500/20 bg-rose-500/5 p-2 divide-y divide-rose-500/10 text-xs">
                  {stats.absentStudents.map((st) => (
                    <div key={st.id} className="py-1.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-ink dark:text-ink-dark">{st.name}</span>
                        <span className="text-[10px] text-ink-muted ml-2">GR: {st.roll}</span>
                      </div>
                      <span className="text-[10px] text-rose-600 font-semibold">{st.remarks}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.lateStudents.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Late Arrivals / Half Day ({stats.lateStudents.length})</span>
                  </span>
                </div>
                <div className="max-h-28 overflow-y-auto rounded-xl border border-amber-500/20 bg-amber-500/5 p-2 divide-y divide-amber-500/10 text-xs">
                  {stats.lateStudents.map((st) => (
                    <div key={st.id} className="py-1.5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-ink dark:text-ink-dark">{st.name}</span>
                        <span className="text-[10px] text-ink-muted ml-2">GR: {st.roll}</span>
                      </div>
                      <span className="text-[10px] text-amber-600 font-semibold">{st.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!stats.isLiveClass && stats.classesCount > 0 && (
              <div className="p-3 rounded-xl bg-surface-secondary/40 dark:bg-surface-secondary-dark/40 border border-line dark:border-line-dark flex items-center justify-between text-xs">
                <span className="text-ink-muted font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" /> Active Classes Tracked
                </span>
                <span className="font-bold text-ink dark:text-ink-dark">{stats.classesCount} Classes</span>
              </div>
            )}
          </>
        )}

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

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : null;
};

export default AttendanceStatsModal;
