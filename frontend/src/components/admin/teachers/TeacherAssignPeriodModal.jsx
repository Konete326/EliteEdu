import { useState, useEffect, useMemo } from 'react';
import { X, CalendarPlus, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../../services/api';
import SearchableSelect from '../../common/SearchableSelect';
import { useToast } from '../../../context/ToastContext';

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

const WEEKDAYS = [
  { value: 'all', label: 'All Weekdays (Mon - Fri)' },
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' }
];

const TeacherAssignPeriodModal = ({
  isOpen,
  teacher,
  onClose,
  onSuccess
}) => {
  const { showToast } = useToast();
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState('');

  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('08:45 AM');
  const [roomNo, setRoomNo] = useState('Room 101');

  useEffect(() => {
    if (!isOpen) return;
    const fetchOptions = async () => {
      try {
        setLoadingData(true);
        const [gRes, sRes] = await Promise.all([
          api.get('/grades').catch(() => ({ data: { grades: [] } })),
          api.get('/subjects?limit=100').catch(() => ({ data: { subjects: [] } }))
        ]);
        setGrades(gRes.data?.grades || []);
        setSubjects(sRes.data?.subjects || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchOptions();
    setConflictError('');
  }, [isOpen]);

  const currentGrade = useMemo(() => {
    return grades.find((g) => g._id === selectedGradeId);
  }, [grades, selectedGradeId]);

  const availableSections = useMemo(() => {
    return currentGrade?.sections && currentGrade.sections.length > 0
      ? currentGrade.sections
      : ['A', 'B', 'C'];
  }, [currentGrade]);

  const handlePeriodChange = (pNo) => {
    const num = Number(pNo);
    setSelectedPeriod(num);
    const standard = PERIOD_DEFAULTS.find((p) => p.period_no === num);
    if (standard) {
      setStartTime(standard.start_time);
      setEndTime(standard.end_time);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGradeId || !selectedSubjectId || !teacher?._id) {
      setConflictError('Please select both a class and a subject.');
      return;
    }

    try {
      setSubmitting(true);
      setConflictError('');
      const applyAll = selectedDay === 'all';
      const payload = {
        grade_id: selectedGradeId,
        section: selectedSection,
        day_of_week: applyAll ? 'Monday' : selectedDay,
        period_no: selectedPeriod,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-line dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink dark:text-white">Assign Class & Period</h3>
              <p className="text-xs text-ink-muted">
                Schedule a routine period for <span className="font-semibold text-primary">{teacher.name}</span>
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
          <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-3.5">
            {conflictError && (
              <div className="p-3 rounded-xl bg-bad/10 border border-bad/20 text-bad text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{conflictError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink dark:text-white mb-1">
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
                <label className="block text-xs font-semibold text-ink dark:text-white mb-1">
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
              <label className="block text-xs font-semibold text-ink dark:text-white mb-1">
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
                <label className="block text-xs font-semibold text-ink dark:text-white mb-1">
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
                <label className="block text-xs font-semibold text-ink dark:text-white mb-1">
                  Period Slot *
                </label>
                <SearchableSelect
                  options={PERIOD_DEFAULTS.map((p) => ({
                    value: p.period_no,
                    label: `Period ${p.period_no} (${p.start_time} - ${p.end_time})`
                  }))}
                  value={selectedPeriod}
                  onChange={handlePeriodChange}
                  searchable={false}
                  size="sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                  Start Time
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs font-mono text-ink dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                  End Time
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs font-mono text-ink dark:text-white outline-none"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                  Room
                </label>
                <input
                  type="text"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  placeholder="e.g. Room 101"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-white outline-none"
                />
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
                  <span>Checking & Assigning...</span>
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
