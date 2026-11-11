import { useState, useEffect } from 'react';
import { Clock, Zap, Save, CheckCircle2, Calendar, Sun, Snowflake } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import { generateClientBellSlots, generateClientFridayBellSlots } from '../../../utils/bellScheduleClientHelper';

const BellScheduleConfigCard = ({ schedule, onSaved, onSlotsPreview }) => {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    school_start_time: '08:00 AM',
    school_end_time: '02:00 PM',
    friday_end_time: '12:30 PM',
    assembly_duration: 15,
    period_duration: 40,
    total_periods: 7,
    friday_total_periods: 5,
    working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    break_after_period: 4,
    break_duration: 30
  });

  useEffect(() => {
    if (schedule) {
      setFormData({
        school_start_time: schedule.school_start_time || '08:00 AM',
        school_end_time: schedule.school_end_time || '02:00 PM',
        friday_end_time: schedule.friday_end_time || '12:30 PM',
        assembly_duration: schedule.assembly_duration ?? 15,
        period_duration: schedule.period_duration ?? 40,
        total_periods: schedule.total_periods ?? 7,
        friday_total_periods: schedule.friday_total_periods ?? 5,
        working_days: schedule.working_days?.length ? schedule.working_days : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        break_after_period: schedule.break_after_period ?? 4,
        break_duration: schedule.break_duration ?? 30
      });
      if (schedule.slots?.length) onSlotsPreview?.(schedule.slots, schedule.friday_slots || []);
    }
  }, [schedule]);

  const handleAutoGenerate = () => {
    const slots = generateClientBellSlots(formData);
    const friday_slots = generateClientFridayBellSlots(formData);
    onSlotsPreview?.(slots, friday_slots);
    showToast(`Generated ${slots.length} daily slots & ${friday_slots.length} Friday slots preview`, 'info');
  };

  const applySummerPreset = () => {
    const updated = {
      ...formData,
      school_start_time: '07:30 AM',
      school_end_time: '01:30 PM',
      friday_end_time: '12:00 PM',
      assembly_duration: 15,
      period_duration: 35,
      total_periods: 7,
      friday_total_periods: 5,
      break_after_period: 4,
      break_duration: 25
    };
    setFormData(updated);
    const slots = generateClientBellSlots(updated);
    const fslots = generateClientFridayBellSlots(updated);
    onSlotsPreview?.(slots, fslots);
    showToast('Applied Summer Timing Preset (07:30 AM - 01:30 PM)', 'info');
  };

  const applyWinterPreset = () => {
    const updated = {
      ...formData,
      school_start_time: '08:30 AM',
      school_end_time: '02:30 PM',
      friday_end_time: '12:45 PM',
      assembly_duration: 15,
      period_duration: 40,
      total_periods: 7,
      friday_total_periods: 5,
      break_after_period: 4,
      break_duration: 30
    };
    setFormData(updated);
    const slots = generateClientBellSlots(updated);
    const fslots = generateClientFridayBellSlots(updated);
    onSlotsPreview?.(slots, fslots);
    showToast('Applied Winter Timing Preset (08:30 AM - 02:30 PM)', 'info');
  };

  const isSaturdayEnabled = formData.working_days.includes('Saturday');

  const toggleSaturday = () => {
    if (isSaturdayEnabled) {
      setFormData({
        ...formData,
        working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      });
    } else {
      setFormData({
        ...formData,
        working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slots = generateClientBellSlots(formData);
      const friday_slots = generateClientFridayBellSlots(formData);
      const res = await api.put('/timetable/bell-schedule', { ...formData, slots, friday_slots });
      showToast('Bell timings and Friday routine saved successfully', 'success');
      onSaved?.(res.data?.schedule);
      onSlotsPreview?.(res.data?.schedule?.slots || slots, res.data?.schedule?.friday_slots || friday_slots);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save bell timings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-surface dark:bg-surface-dark p-6 rounded-2xl border border-line dark:border-line-dark shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line dark:border-line-dark">
        <div>
          <h3 className="font-bold text-base text-ink dark:text-ink-dark flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>School Timing &amp; Pakistani Routine Setup</span>
          </h3>
          <p className="text-xs text-ink-muted">Configure daily school hours, Friday Jumma early off, and weekly working days</p>
        </div>
        <button
          type="button"
          onClick={handleAutoGenerate}
          className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Preview Slot Timings</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-3 bg-surface-secondary/40 rounded-xl border border-line dark:border-line-dark">
        <span className="text-xs font-bold text-ink dark:text-ink-dark mr-1">Quick Timing Presets:</span>
        <button
          type="button"
          onClick={applySummerPreset}
          className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          <span>Summer Timing (07:30 AM - 01:30 PM)</span>
        </button>
        <button
          type="button"
          onClick={applyWinterPreset}
          className="px-3 py-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Snowflake className="w-3.5 h-3.5 text-sky-500" />
          <span>Winter Timing (08:30 AM - 02:30 PM)</span>
        </button>
      </div>

      <div className="p-3 bg-surface-secondary/40 rounded-xl border border-line dark:border-line-dark flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <div>
            <span className="text-xs font-bold text-ink dark:text-ink-dark block">Weekly Working Days</span>
            <span className="text-[11px] text-ink-muted">Set whether your school operates 5 days (Mon-Fri) or 6 days (Mon-Sat)</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-surface dark:bg-surface-dark p-1 rounded-xl border border-line dark:border-line-dark">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] })}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              !isSaturdayEnabled
                ? 'bg-primary text-white shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            5 Days (Mon - Fri)
          </button>
          <button
            type="button"
            onClick={toggleSaturday}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              isSaturdayEnabled
                ? 'bg-primary text-white shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            6 Days (Mon - Sat)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Morning Opening Time</label>
          <input
            type="text"
            value={formData.school_start_time}
            onChange={(e) => setFormData({ ...formData, school_start_time: e.target.value })}
            className="w-full px-3 py-2 border border-line dark:border-line-dark rounded-xl text-xs bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark outline-none"
            placeholder="08:00 AM"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Normal Day Closing (Mon - Thu, Sat)</label>
          <input
            type="text"
            value={formData.school_end_time}
            onChange={(e) => setFormData({ ...formData, school_end_time: e.target.value })}
            className="w-full px-3 py-2 border border-line dark:border-line-dark rounded-xl text-xs bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark outline-none"
            placeholder="02:00 PM"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Friday Early Closing (Jumma Half-Day)</label>
          <input
            type="text"
            value={formData.friday_end_time}
            onChange={(e) => setFormData({ ...formData, friday_end_time: e.target.value })}
            className="w-full px-3 py-2 border border-line dark:border-line-dark rounded-xl text-xs bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark outline-none"
            placeholder="12:30 PM"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div>
          <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Assembly (Mins)</label>
          <input
            type="number"
            min="0"
            max="60"
            value={formData.assembly_duration}
            onChange={(e) => setFormData({ ...formData, assembly_duration: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-line dark:border-line-dark rounded-xl text-xs bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Period (Mins)</label>
          <input
            type="number"
            min="20"
            max="90"
            value={formData.period_duration}
            onChange={(e) => setFormData({ ...formData, period_duration: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-line dark:border-line-dark rounded-xl text-xs bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Regular Periods</label>
          <input
            type="number"
            min="3"
            max="10"
            value={formData.total_periods}
            onChange={(e) => setFormData({ ...formData, total_periods: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-line dark:border-line-dark rounded-xl text-xs bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Friday Periods</label>
          <input
            type="number"
            min="2"
            max="8"
            value={formData.friday_total_periods}
            onChange={(e) => setFormData({ ...formData, friday_total_periods: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-line dark:border-line-dark rounded-xl text-xs bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">Break After P#</label>
          <input
            type="number"
            min="1"
            max="8"
            value={formData.break_after_period}
            onChange={(e) => setFormData({ ...formData, break_after_period: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-line dark:border-line-dark rounded-xl text-xs bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="text-xs text-ink-muted flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Regular: {formData.total_periods} periods | Friday: {formData.friday_total_periods} periods (off at {formData.friday_end_time})</span>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Bell Timings & Schedule'}</span>
        </button>
      </div>
    </form>
  );
};

export default BellScheduleConfigCard;
