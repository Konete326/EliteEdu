import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Users, Loader2, Calendar, RotateCcw } from 'lucide-react';
import { normalizeTimeString } from '../../../../utils/timeFormatters';
import TimePickerPopover from '../../../common/TimePickerPopover';
import StaffAttendanceCalendarModal from './StaffAttendanceCalendarModal';

const STATUS_BUTTONS = [
  { code: 'P', label: 'P', activeClass: 'bg-emerald-600 text-white ring-2 ring-emerald-500/40' },
  { code: 'A', label: 'A', activeClass: 'bg-rose-600 text-white ring-2 ring-rose-500/40' },
  { code: 'L', label: 'L', activeClass: 'bg-sky-600 text-white ring-2 ring-sky-500/40' },
  { code: 'SL', label: 'SL', activeClass: 'bg-cyan-600 text-white ring-2 ring-cyan-500/40' },
  { code: 'Late', label: 'Late', activeClass: 'bg-amber-600 text-white ring-2 ring-amber-500/40' },
  { code: 'Hol', label: 'H', activeClass: 'bg-orange-600 text-white ring-2 ring-orange-500/40' },
  { code: 'HD', label: 'HD', activeClass: 'bg-purple-600 text-white ring-2 ring-purple-500/40' },
  { code: 'Off', label: 'Off', activeClass: 'bg-slate-600 text-white ring-2 ring-slate-500/40' },
  { code: 'U', label: 'U', activeClass: 'bg-slate-500 text-white ring-2 ring-slate-400/40' }
];

const StaffAttendanceTableCard = ({
  records = [],
  loading = false,
  onStatusChange,
  onTimeChange,
  onResetFilters,
  hasActiveFilters = false
}) => {
  const [activeTimePicker, setActiveTimePicker] = useState(null);
  const [selectedStaffCalendar, setSelectedStaffCalendar] = useState(null);
  const [settingsVersion, setSettingsVersion] = useState(0);

  useEffect(() => {
    return () => {
      setActiveTimePicker(null);
      setSelectedStaffCalendar(null);
    };
  }, []);

  useEffect(() => {
    if (!activeTimePicker) return;
    const handleDismiss = () => setActiveTimePicker(null);
    window.addEventListener('scroll', handleDismiss, true);
    window.addEventListener('resize', handleDismiss);
    return () => {
      window.removeEventListener('scroll', handleDismiss, true);
      window.removeEventListener('resize', handleDismiss);
    };
  }, [activeTimePicker]);

  useEffect(() => {
    const handleSettingsUpdate = () => setSettingsVersion((v) => v + 1);
    window.addEventListener('elite_attendance_settings_updated', handleSettingsUpdate);
    window.addEventListener('elite_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);
    return () => {
      window.removeEventListener('elite_attendance_settings_updated', handleSettingsUpdate);
      window.removeEventListener('elite_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  const defaultInPlaceholder = useMemo(() => {
    try {
      const raw = localStorage.getItem('elite_attendance_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.entryTime) return normalizeTimeString(parsed.entryTime);
      }
    } catch {}
    return '08:00 AM';
  }, [settingsVersion]);

  const defaultOutPlaceholder = useMemo(() => {
    try {
      const raw = localStorage.getItem('elite_attendance_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.departureTime) return normalizeTimeString(parsed.departureTime);
      }
    } catch {}
    return '02:00 PM';
  }, [settingsVersion]);

  const handleOpenTimePicker = (e, staffId, field, currentValue, placeholder) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveTimePicker({
      staffId,
      field,
      anchorRect: rect,
      currentValue: currentValue || '',
      placeholder
    });
  };

  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-xs overflow-hidden flex flex-col flex-1 min-h-0">
      <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 h-full">
        <table className="hidden md:table w-full text-left border-collapse min-w-[820px]">
          <thead className="sticky top-0 z-10 bg-surface dark:bg-surface-dark shadow-2xs border-b border-line dark:border-line-dark text-[11px] font-bold uppercase tracking-wider text-ink-muted">
            <tr className="border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
              <th className="py-3 px-3 text-center w-14 bg-surface dark:bg-surface-dark">S.NO</th>
              <th className="py-3 px-4 min-w-[200px] bg-surface dark:bg-surface-dark">NAME</th>
              <th className="py-3 px-4 min-w-[160px] bg-surface dark:bg-surface-dark">FATHER NAME</th>
              <th className="py-3 px-4 w-36 bg-surface dark:bg-surface-dark">TIME IN</th>
              <th className="py-3 px-4 w-36 bg-surface dark:bg-surface-dark">TIME OUT</th>
              <th className="py-3 px-4 text-center min-w-[320px] bg-surface dark:bg-surface-dark">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark text-xs">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-ink-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span>Loading staff members...</span>
                  </div>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto text-ink-muted">
                    <Users className="w-8 h-8 stroke-[1.5]" />
                    <span className="text-sm font-semibold text-ink dark:text-ink-dark">No Staff Records Found</span>
                    <span className="text-xs">Adjust your search or department filter, or click Show to refresh.</span>
                    {hasActiveFilters && onResetFilters && (
                      <button
                        type="button"
                        onClick={onResetFilters}
                        className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all cursor-pointer shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Filters</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              records.map((item, index) => {
                const staff = item.staff || {};
                const currentStatus = item.status || 'U';

                return (
                  <tr
                    key={staff._id || index}
                    className="hover:bg-surface-secondary/30 dark:hover:bg-surface-secondary-dark/30 transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-bold text-ink-muted">
                      {index + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-ink dark:text-ink-dark">
                          {staff.name || 'Unnamed Staff'}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[10px] text-ink-muted font-medium">
                            {staff.employee_code ? `EMP: ${staff.employee_code}` : (staff.designation || 'Staff')}
                          </span>
                          {staff.department && (
                            <span className="text-[10px] text-primary font-semibold">
                              • {staff.department}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedStaffCalendar(staff)}
                            title="View Monthly Attendance Calendar"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-primary hover:bg-primary/10 transition-all cursor-pointer border border-primary/20"
                          >
                            <Calendar className="w-2.5 h-2.5" />
                            <span>Calendar</span>
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-ink-sub dark:text-ink-sub-dark font-medium">
                      {staff.father_name || '-'}
                    </td>

                    <td className="py-3 px-4">
                      <div
                        onClick={(e) => handleOpenTimePicker(e, staff._id, 'check_in_time', item.check_in_time, defaultInPlaceholder)}
                        className="relative cursor-pointer group"
                      >
                        <Clock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted group-hover:text-primary transition-colors pointer-events-none" />
                        <input
                          type="text"
                          value={item.check_in_time || ''}
                          placeholder={defaultInPlaceholder}
                          readOnly
                          className="w-28 pl-7 pr-2 py-1.5 text-xs font-mono rounded-xl bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark text-ink dark:text-ink-dark group-hover:border-primary group-hover:bg-primary/[0.03] outline-none cursor-pointer transition-all"
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div
                        onClick={(e) => handleOpenTimePicker(e, staff._id, 'check_out_time', item.check_out_time, defaultOutPlaceholder)}
                        className="relative cursor-pointer group"
                      >
                        <Clock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted group-hover:text-primary transition-colors pointer-events-none" />
                        <input
                          type="text"
                          value={item.check_out_time || ''}
                          placeholder={defaultOutPlaceholder}
                          readOnly
                          className="w-28 pl-7 pr-2 py-1.5 text-xs font-mono rounded-xl bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark text-ink dark:text-ink-dark group-hover:border-primary group-hover:bg-primary/[0.03] outline-none cursor-pointer transition-all"
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {STATUS_BUTTONS.map((btn) => {
                          const isSelected = currentStatus === btn.code ||
                            (btn.code === 'Late' && currentStatus === 'LT') ||
                            (btn.code === 'Hol' && currentStatus === 'H');

                          return (
                            <button
                              key={btn.code}
                              type="button"
                              onClick={() => onStatusChange(staff._id, btn.code)}
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? `${btn.activeClass} shadow-xs scale-105`
                                  : 'bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink-muted hover:border-slate-400 hover:text-ink dark:hover:text-ink-dark'
                              }`}
                            >
                              {btn.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        <div className="block md:hidden p-2 space-y-2">
          {loading ? (
            <div className="py-12 text-center text-ink-muted">
              <div className="flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span>Loading staff members...</span>
              </div>
            </div>
          ) : records.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto text-ink-muted">
                <Users className="w-8 h-8 stroke-[1.5]" />
                <span className="text-sm font-semibold text-ink dark:text-ink-dark">No Staff Records Found</span>
                <span className="text-xs">Adjust your search or department filter, or click Show to refresh.</span>
                {hasActiveFilters && onResetFilters && (
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            records.map((item, index) => {
              const staff = item.staff || {};
              const currentStatus = item.status || 'U';

              return (
                <div
                  key={staff._id || index}
                  className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-ink-muted">#{index + 1}</span>
                        <h4 className="font-bold text-xs text-ink dark:text-ink-dark truncate">{staff.name || 'Unnamed Staff'}</h4>
                      </div>
                      <p className="text-[10px] text-ink-muted truncate">
                        {staff.employee_code ? `EMP: ${staff.employee_code}` : (staff.designation || 'Staff')}
                        {staff.department && ` • ${staff.department}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 text-[10px]">
                      <button
                        type="button"
                        onClick={(e) => handleOpenTimePicker(e, staff._id || index, 'in', item.time_in, defaultInPlaceholder)}
                        className="px-2 py-1 rounded-lg border border-line dark:border-line-dark bg-surface-secondary dark:bg-surface-secondary-dark font-mono font-bold text-ink dark:text-ink-dark hover:border-primary transition-all cursor-pointer"
                      >
                        In: {item.time_in || defaultInPlaceholder}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleOpenTimePicker(e, staff._id || index, 'out', item.time_out, defaultOutPlaceholder)}
                        className="px-2 py-1 rounded-lg border border-line dark:border-line-dark bg-surface-secondary dark:bg-surface-secondary-dark font-mono font-bold text-ink dark:text-ink-dark hover:border-primary transition-all cursor-pointer"
                      >
                        Out: {item.time_out || defaultOutPlaceholder}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-0.5 bg-surface-secondary dark:bg-surface-secondary-dark p-0.5 rounded-lg border border-line dark:border-line-dark overflow-x-auto">
                    {STATUS_BUTTONS.map((btn) => (
                      <button
                        key={btn.code}
                        type="button"
                        title={btn.code}
                        onClick={() => onStatusChange(staff._id || index, btn.code)}
                        className={`flex-1 py-1 px-1 rounded-md text-[10px] font-black transition-all cursor-pointer text-center ${
                          currentStatus === btn.code
                            ? btn.activeClass
                            : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {activeTimePicker && (
        <TimePickerPopover
          anchorRect={activeTimePicker.anchorRect}
          value={activeTimePicker.currentValue}
          defaultPlaceholder={activeTimePicker.placeholder}
          presetStart={defaultInPlaceholder}
          presetEnd={defaultOutPlaceholder}
          onChange={(newTime) => {
            onTimeChange(activeTimePicker.staffId, activeTimePicker.field, newTime);
          }}
          onClose={() => setActiveTimePicker(null)}
        />
      )}

      <StaffAttendanceCalendarModal
        isOpen={Boolean(selectedStaffCalendar)}
        onClose={() => setSelectedStaffCalendar(null)}
        staff={selectedStaffCalendar}
      />
    </div>
  );
};

export default StaffAttendanceTableCard;
