import { createPortal } from 'react-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, User, Loader2 } from 'lucide-react';
import api from '../../../../services/api';

const STATUS_COLOR_MAP = {
  P: 'bg-emerald-600 text-white',
  A: 'bg-rose-600 text-white',
  L: 'bg-sky-600 text-white',
  SL: 'bg-cyan-600 text-white',
  Late: 'bg-amber-600 text-white',
  LT: 'bg-amber-600 text-white',
  Hol: 'bg-orange-600 text-white',
  H: 'bg-orange-600 text-white',
  HD: 'bg-purple-600 text-white',
  Off: 'bg-slate-600 text-white',
  U: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
};

const StaffAttendanceCalendarModal = ({ isOpen, onClose, staff }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !staff?._id) return;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const [year, m] = currentMonth.split('-');
        const from = `${currentMonth}-01`;
        const lastDay = new Date(Number(year), Number(m), 0).getDate();
        const to = `${currentMonth}-${String(lastDay).padStart(2, '0')}`;
        const res = await api.get('/staff-attendance/my-history', {
          params: { staff_id: staff._id, from, to, limit: 35 }
        });
        setHistory(res.data.history || []);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [isOpen, staff?._id, currentMonth]);

  const daysInMonth = useMemo(() => {
    const [year, m] = currentMonth.split('-');
    const totalDays = new Date(Number(year), Number(m), 0).getDate();
    const firstDayOfWeek = new Date(Number(year), Number(m) - 1, 1).getDay();
    const attendanceMap = new Map();
    history.forEach((h) => attendanceMap.set(h.date, h));

    const list = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      list.push({ empty: true });
    }
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${currentMonth}-${String(d).padStart(2, '0')}`;
      const record = attendanceMap.get(dateStr);
      list.push({
        day: d,
        date: dateStr,
        status: record?.status || null,
        checkIn: record?.check_in_time || '',
        checkOut: record?.check_out_time || '',
        record
      });
    }
    return list;
  }, [currentMonth, history]);

  const monthSummary = useMemo(() => {
    const counts = { P: 0, A: 0, L: 0, Late: 0, Hol: 0 };
    history.forEach((h) => {
      if (h.status === 'P') counts.P++;
      else if (h.status === 'A') counts.A++;
      else if (h.status === 'L' || h.status === 'SL') counts.L++;
      else if (h.status === 'Late' || h.status === 'LT') counts.Late++;
      else if (h.status === 'Hol' || h.status === 'H' || h.status === 'Off') counts.Hol++;
    });
    return counts;
  }, [history]);

  if (!isOpen || !staff) return null;

  const handlePrevMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number);
    const d = new Date(y, m - 2, 1);
    setCurrentMonth(d.toISOString().slice(0, 7));
  };

  const handleNextMonth = () => {
    const [y, m] = currentMonth.split('-').map(Number);
    const d = new Date(y, m, 1);
    setCurrentMonth(d.toISOString().slice(0, 7));
  };

  const modalNode = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink dark:text-ink-dark">
                {staff.name}
              </h3>
              <p className="text-xs text-ink-muted">
                {staff.employee_code ? `EMP: ${staff.employee_code}` : (staff.designation || 'Staff')} • Attendance Calendar
              </p>
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

        <div className="flex items-center justify-between bg-surface-secondary/40 dark:bg-surface-secondary-dark/40 p-2.5 rounded-2xl border border-line dark:border-line-dark">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl hover:bg-surface text-ink-muted hover:text-ink transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-ink dark:text-ink-dark">
            {new Date(`${currentMonth}-01`).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl hover:bg-surface text-ink-muted hover:text-ink transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[10px] font-bold text-emerald-600 block">Present</span>
            <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">{monthSummary.P}</span>
          </div>
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <span className="text-[10px] font-bold text-rose-600 block">Absent</span>
            <span className="text-sm font-black text-rose-700 dark:text-rose-400">{monthSummary.A}</span>
          </div>
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
            <span className="text-[10px] font-bold text-sky-600 block">Leave</span>
            <span className="text-sm font-black text-sky-700 dark:text-sky-400">{monthSummary.L}</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-600 block">Late</span>
            <span className="text-sm font-black text-amber-700 dark:text-amber-400">{monthSummary.Late}</span>
          </div>
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <span className="text-[10px] font-bold text-orange-600 block">Holiday</span>
            <span className="text-sm font-black text-orange-700 dark:text-orange-400">{monthSummary.Hol}</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-ink-muted flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>Loading monthly calendar...</span>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-ink-muted uppercase pb-1.5">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {daysInMonth.map((cell, idx) => {
                if (cell.empty) {
                  return <div key={`empty-${idx}`} className="h-10 rounded-xl" />;
                }
                const badgeClass = cell.status ? (STATUS_COLOR_MAP[cell.status] || 'bg-slate-200 text-slate-700') : 'border border-line text-ink-muted';
                return (
                  <div
                    key={cell.date}
                    title={`${cell.date}${cell.status ? ` - ${cell.status}` : ' - Unmarked'}`}
                    className={`h-11 rounded-xl p-1 flex flex-col items-center justify-between text-xs transition-all ${
                      cell.status
                        ? badgeClass
                        : 'bg-surface-secondary/40 dark:bg-surface-secondary-dark/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark'
                    }`}
                  >
                    <span className="text-[10px] font-bold">{cell.day}</span>
                    {cell.status ? (
                      <span className="text-[9px] font-black uppercase tracking-wider">{cell.status}</span>
                    ) : (
                      <span className="text-[9px] opacity-40">-</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : null;
};

export default StaffAttendanceCalendarModal;
