import { useState, useEffect, useMemo } from 'react';
import { X, CalendarPlus, AlertCircle, AlertTriangle, Loader2, Clock, Sparkles } from 'lucide-react';
import api from '../../../services/api';
import SearchableSelect from '../../common/SearchableSelect';
import { useToast } from '../../../context/ToastContext';

const parseTimeToMinutes = (str) => {
  if (!str || typeof str !== 'string') return null;
  const match = str.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return null;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const meridiem = match[3] ? match[3].toUpperCase() : null;
  if (meridiem === 'PM' && h < 12) h += 12;
  if (meridiem === 'AM' && h === 12) h = 0;
  return h * 60 + m;
};

const isTimeOverlap = (startA, endA, startB, endB) => {
  const sA = parseTimeToMinutes(startA);
  const eA = parseTimeToMinutes(endA);
  const sB = parseTimeToMinutes(startB);
  const eB = parseTimeToMinutes(endB);
  if (sA === null || eA === null || sB === null || eB === null) return false;
  return sA < eB && eA > sB;
};

const PERIOD_DEFAULTS = [
  { period_no: 1, start_time: '08:00 AM', end_time: '08:45 AM' },
  { period_no: 2, start_time: '08:45 AM', end_time: '09:30 AM' },
  { period_no: 3, start_time: '09:30 AM', end_time: '10:15 AM' },
  { period_no: 4, start_time: '10:45 AM', end_time: '11:30 AM' },
  { period_no: 5, start_time: '11:30 AM', end_time: '12:15 PM' },
  { period_no: 6, start_time: '12:15 PM', end_time: '01:00 PM' },
  { period_no: 7, start_time: '01:30 PM', end_time: '02:15 PM' },
  { period_no: 8, start_time: '02:15 PM', end_time: '03:00 PM' }
];

const QUICK_TIME_PRESETS = [
  { label: '08:00 AM - 08:45 AM', start: '08:00 AM', end: '08:45 AM' },
  { label: '08:45 AM - 09:30 AM', start: '08:45 AM', end: '09:30 AM' },
  { label: '09:30 AM - 10:15 AM', start: '09:30 AM', end: '10:15 AM' },
  { label: '10:45 AM - 11:30 AM', start: '10:45 AM', end: '11:30 AM' },
  { label: '11:30 AM - 12:15 PM', start: '11:30 AM', end: '12:15 PM' },
  { label: '12:15 PM - 01:00 PM', start: '12:15 PM', end: '01:00 PM' },
  { label: '01:30 PM - 02:15 PM', start: '01:30 PM', end: '02:15 PM' },
  { label: '02:15 PM - 03:00 PM', start: '02:15 PM', end: '03:00 PM' }
];

const WEEKDAYS = [
  { value: 'all', label: 'All Weekdays (Mon - Fri)' },
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' }
];

const to24Hour = (time12h) => {
  if (!time12h) return '08:00';
  const match = String(time12h).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return '08:00';
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3] ? match[3].toUpperCase() : null;
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${minutes}`;
};

const to12Hour = (time24h) => {
  if (!time24h) return '08:00 AM';
  const [hStr, mStr] = time24h.split(':');
  let hours = parseInt(hStr, 10);
  const minutes = mStr || '00';
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};

const TeacherAssignPeriodModal = ({
  isOpen,
  teacher,
  onClose,
  onSuccess
}) => {
  const { showToast } = useToast();
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [existingSlots, setExistingSlots] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState('');

  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedPeriod, setSelectedPeriod] = useState('1');
  const [customPeriodNo, setCustomPeriodNo] = useState('9');
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('08:45 AM');
  const [roomNo, setRoomNo] = useState('Room 101');

  useEffect(() => {
    if (!isOpen) return;
    const fetchOptions = async () => {
      try {
        setLoadingData(true);
        const [gRes, sRes, tRes] = await Promise.all([
          api.get('/grades').catch(() => ({ data: { grades: [] } })),
          api.get('/subjects?limit=100').catch(() => ({ data: { subjects: [] } })),
          teacher?._id ? api.get(`/timetable?teacher_id=${teacher._id}`).catch(() => ({ data: { slots: [] } })) : Promise.resolve({ data: { slots: [] } })
        ]);
        setGrades(gRes.data?.grades || []);
        setSubjects(sRes.data?.subjects || []);
        setExistingSlots(tRes.data?.slots || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchOptions();
    setConflictError('');
  }, [isOpen, teacher?._id]);

  const currentGrade = useMemo(() => {
    return grades.find((g) => g._id === selectedGradeId);
  }, [grades, selectedGradeId]);

  const availableSections = useMemo(() => {
    return currentGrade?.sections && currentGrade.sections.length > 0
      ? currentGrade.sections
      : ['A', 'B', 'C'];
  }, [currentGrade]);

  const handlePeriodChange = (val) => {
    setSelectedPeriod(String(val));
    if (val !== 'custom') {
      const num = Number(val);
      const standard = PERIOD_DEFAULTS.find((p) => p.period_no === num);
      if (standard) {
        setStartTime(standard.start_time);
        setEndTime(standard.end_time);
      }
    }
  };

  const isCustom = selectedPeriod === 'custom';

  const detectedConflict = useMemo(() => {
    if (!existingSlots.length) return null;
    const resolvedPeriodNo = isCustom ? (Number(customPeriodNo) || 9) : Number(selectedPeriod);
    const daysToCheck = selectedDay === 'all'
      ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      : [selectedDay];

    for (const day of daysToCheck) {
      for (const slot of existingSlots) {
        if (slot.day_of_week !== day || slot.is_break) continue;
        const slotGradeId = String(slot.grade_id?._id || slot.grade_id || '');
        const slotSection = String(slot.section || '').trim().toUpperCase();
        const curGradeId = String(selectedGradeId || '');
        const curSection = String(selectedSection || '').trim().toUpperCase();

        const isDiff = slotGradeId !== curGradeId || slotSection !== curSection;
        const periodMatch = Number(slot.period_no) === resolvedPeriodNo;
        const timeMatch = isTimeOverlap(startTime, endTime, slot.start_time, slot.end_time);

        if (isDiff && (periodMatch || timeMatch)) {
          return {
            day,
            period: slot.period_no,
            time: `${slot.start_time || '—'} - ${slot.end_time || '—'}`,
            className: slot.grade_id?.name || 'Another Class',
            section: slot.section,
            subject: slot.subject_id?.name || 'Class Routine'
          };
        }
      }
    }
    return null;
  }, [existingSlots, isCustom, customPeriodNo, selectedPeriod, selectedDay, selectedGradeId, selectedSection, startTime, endTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGradeId || !selectedSubjectId || !teacher?._id) {
      setConflictError('Please select both a class and a subject.');
      return;
    }

    if (detectedConflict) {
      setConflictError(`Schedule Conflict: ${teacher.name} is already assigned to ${detectedConflict.className} (${detectedConflict.section}) during Period ${detectedConflict.period} (${detectedConflict.time}) on ${detectedConflict.day}.`);
      return;
    }

    try {
      setSubmitting(true);
      setConflictError('');
      const applyAll = selectedDay === 'all';
      const resolvedPeriodNo = isCustom ? (Number(customPeriodNo) || 9) : Number(selectedPeriod);

      const payload = {
        grade_id: selectedGradeId,
        section: selectedSection,
        day_of_week: applyAll ? 'Monday' : selectedDay,
        period_no: resolvedPeriodNo,
        start_time: startTime,
        end_time: endTime,
        subject_id: selectedSubjectId,
        teacher_id: teacher._id,
        room_no: roomNo.trim() || 'Room 101',
        apply_all_weekdays: applyAll,
        campus_id: teacher.campus_id?._id || teacher.campus_id || null
      };

      const res = await api.post('/timetable/assign', payload);
      showToast(res.data?.message || 'Period routine assigned successfully', 'success');
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to assign timetable slot';
      setConflictError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !teacher) return null;

  const periodOptions = [
    ...PERIOD_DEFAULTS.map((p) => ({
      value: String(p.period_no),
      label: `Period ${p.period_no} (${p.start_time} - ${p.end_time})`
    })),
    { value: 'custom', label: '✏️ Custom Period Slot (Set Own Time)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in duration-150">
        <div className="p-5 border-b border-line dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink dark:text-white">Assign Class &amp; Period</h3>
              <p className="text-xs font-semibold text-ink-muted">
                Schedule a routine period for <span className="font-bold text-primary">{teacher.name}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
            {detectedConflict && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Teacher Schedule Conflict Detected</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  <span className="font-bold">{teacher.name}</span> is already teaching{' '}
                  <span className="font-bold underline">{detectedConflict.className} ({detectedConflict.section})</span> for {detectedConflict.subject} during Period {detectedConflict.period} ({detectedConflict.time}) on {detectedConflict.day}.
                </p>
                <p className="text-[10px] text-amber-700/90 dark:text-amber-400/90 italic">
                  Assigning this slot will create a timetable double-booking clash. Please choose a different period or time.
                </p>
              </div>
            )}

            {conflictError && (
              <div className="p-3 rounded-xl bg-bad/10 border border-bad/20 text-bad text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{conflictError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                  Class / Grade *
                </label>
                <SearchableSelect
                  options={grades.map((g) => ({ value: g._id, label: g.name }))}
                  value={selectedGradeId}
                  onChange={(val) => {
                    setSelectedGradeId(val);
                    setConflictError('');
                  }}
                  placeholder="Select class..."
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                  Section *
                </label>
                <SearchableSelect
                  options={availableSections.map((sec) => ({ value: sec, label: `Section ${sec}` }))}
                  value={selectedSection}
                  onChange={setSelectedSection}
                  searchable={false}
                  size="sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                Subject to Teach *
              </label>
              <SearchableSelect
                options={subjects.map((s) => ({
                  value: s._id,
                  label: s.name,
                  subtext: s.code ? `Code: ${s.code}` : ''
                }))}
                value={selectedSubjectId}
                onChange={(val) => {
                  setSelectedSubjectId(val);
                  setConflictError('');
                }}
                placeholder="Select subject..."
                size="sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                  Day Schedule *
                </label>
                <SearchableSelect
                  options={WEEKDAYS}
                  value={selectedDay}
                  onChange={setSelectedDay}
                  searchable={false}
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink dark:text-white mb-1">
                  Period Slot *
                </label>
                <SearchableSelect
                  options={periodOptions}
                  value={selectedPeriod}
                  onChange={handlePeriodChange}
                  searchable={false}
                  size="sm"
                />
              </div>
            </div>

            {isCustom && (
              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Sparkles className="w-4 h-4" />
                  <span>Custom Period Settings</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                    Custom Period Number (e.g. 0 for Zero Period, 9, 10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={customPeriodNo}
                    onChange={(e) => setCustomPeriodNo(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-[#141414] text-xs font-bold font-mono text-ink dark:text-white outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 pt-1 border-t border-line dark:border-white/10">
              <label className="block text-xs font-bold text-ink dark:text-white">
                Class Timing &amp; Clock Picker
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" /> Start Time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={to24Hour(startTime)}
                      onChange={(e) => setStartTime(to12Hour(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141414] text-xs font-mono font-bold text-ink dark:text-white outline-none focus:border-primary cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] text-ink-muted font-mono mt-0.5 block">{startTime}</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" /> End Time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={to24Hour(endTime)}
                      onChange={(e) => setEndTime(to12Hour(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141414] text-xs font-mono font-bold text-ink dark:text-white outline-none focus:border-primary cursor-pointer"
                    />
                  </div>
                  <span className="text-[10px] text-ink-muted font-mono mt-0.5 block">{endTime}</span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                    Room No
                  </label>
                  <input
                    type="text"
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    placeholder="e.g. Room 101"
                    className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141414] text-xs font-medium text-ink dark:text-white outline-none focus:border-primary"
                  />
                  <span className="text-[10px] text-ink-muted mt-0.5 block">Campus Classroom</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider block mb-1">
                  Quick Time Presets
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                  {QUICK_TIME_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setStartTime(p.start);
                        setEndTime(p.end);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer border ${
                        startTime === p.start && endTime === p.end
                          ? 'bg-primary text-white border-primary shadow-2xs'
                          : 'bg-surface-secondary/60 dark:bg-[#141414] border-line dark:border-white/10 text-ink-muted hover:text-ink'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-line dark:border-white/10 flex items-center justify-end gap-2.5 bg-surface-secondary/30 dark:bg-surface-secondary-dark/30 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl border border-line dark:border-line-dark text-xs font-semibold text-ink-muted hover:bg-surface-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loadingData}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking &amp; Assigning...</span>
                </>
              ) : (
                <span>Assign Period</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherAssignPeriodModal;