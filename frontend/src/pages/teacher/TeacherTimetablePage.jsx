import { useState, useEffect } from 'react';
import { Calendar, Clock, Printer, Loader2, Shuffle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import TeacherDayTimeline from '../../components/teacher/timetable/TeacherDayTimeline';
import TimetableMatrixGrid from '../../components/admin/timetable/TimetableMatrixGrid';
import TimetablePrintModal from '../../components/admin/timetable/TimetablePrintModal';
import TeacherPeriodAdjustmentModal from '../../components/teacher/timetable/TeacherPeriodAdjustmentModal';

const TeacherTimetablePage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('today');
  const [selectedDay, setSelectedDay] = useState('');
  const [scheduleData, setScheduleData] = useState(null);
  const [weeklySlots, setWeeklySlots] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrint, setShowPrint] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedSlotForAdjustment, setSelectedSlotForAdjustment] = useState(null);

  const fetchDailySchedule = async (day) => {
    try {
      const q = day ? `?day_of_week=${day}` : '';
      const res = await api.get(`/timetable/my-schedule${q}`);
      if (res.data?.success) {
        setScheduleData(res.data);
        if (!selectedDay) setSelectedDay(res.data.day_of_week || 'Monday');
      }
    } catch {}
  };

  const fetchWeeklySlots = async () => {
    try {
      const res = await api.get(`/timetable?teacher_id=${user?.id}`);
      if (res.data?.slots) setWeeklySlots(res.data.slots);
    } catch {}
  };

  const fetchMetadata = async () => {
    try {
      const [gRes, sRes] = await Promise.all([
        api.get('/grades').catch(() => ({ data: [] })),
        api.get('/subjects').catch(() => ({ data: [] }))
      ]);
      setGrades(gRes.data?.grades || gRes.data?.data || gRes.data || []);
      setSubjects(sRes.data?.subjects || sRes.data?.data || sRes.data || []);
    } catch {}
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDailySchedule(), fetchWeeklySlots(), fetchMetadata()]).finally(() => setLoading(false));
  }, []);

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    fetchDailySchedule(day);
  };

  const handleOpenAdjustment = (slot) => {
    setSelectedSlotForAdjustment(slot);
    setShowAdjustmentModal(true);
  };

  const handleRevertAdjustment = async (adjustmentId) => {
    if (!adjustmentId) return;
    try {
      const res = await api.delete(`/timetable/substitutions/${adjustmentId}`);
      if (res.data?.success) {
        showToast('Period adjustment reverted to standard timetable', 'success');
        fetchDailySchedule(selectedDay);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to revert adjustment', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { bellSchedule, periodTimeline, currentSlot, nextSlot, day_of_week } = scheduleData || {};

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-ink-dark flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" /> Faculty Timetable &amp; Bell Schedule
          </h1>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
            Track daily periods, manage proxy / extra classes, and view full weekly roster
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleOpenAdjustment(null)}
            className="px-3.5 py-1.5 bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary dark:text-primary-hover rounded-xl text-xs font-bold flex items-center gap-1.5 border border-primary/20 transition-all shadow-xs cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" /> Quick Adjust / Proxy
          </button>

          <div className="bg-surface-secondary dark:bg-surface-secondary-dark p-1 rounded-2xl flex border border-line dark:border-line-dark">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-surface dark:bg-surface-dark text-primary shadow-xs'
                  : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Live Today
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'weekly'
                  ? 'bg-surface dark:bg-surface-dark text-primary shadow-xs'
                  : 'text-ink-muted dark:text-ink-muted-dark hover:text-ink'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Weekly Grid
            </button>
          </div>

          <button
            onClick={() => setShowPrint(true)}
            className="px-3.5 py-1.5 bg-surface dark:bg-surface-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark text-ink dark:text-ink-dark rounded-xl text-xs font-bold flex items-center gap-1.5 border border-line dark:border-line-dark transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print A4
          </button>
        </div>
      </div>

      {activeTab === 'today' ? (
        <div className="space-y-6">
          <TeacherDayTimeline
            selectedDay={selectedDay || day_of_week || 'Monday'}
            onSelectDay={handleSelectDay}
            timeline={periodTimeline || []}
            todayDay={day_of_week}
            onOpenAdjustment={handleOpenAdjustment}
            onRevertAdjustment={handleRevertAdjustment}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <TimetableMatrixGrid
            slots={weeklySlots}
            viewMode="teacher"
            bellSchedule={bellSchedule}
            canManage={false}
          />
        </div>
      )}

      <TeacherPeriodAdjustmentModal
        isOpen={showAdjustmentModal}
        onClose={() => {
          setShowAdjustmentModal(false);
          setSelectedSlotForAdjustment(null);
        }}
        onSuccess={() => {
          fetchDailySchedule(selectedDay);
        }}
        initialSlot={selectedSlotForAdjustment}
        grades={grades}
        subjects={subjects}
      />

      <TimetablePrintModal
        isOpen={showPrint}
        onClose={() => setShowPrint(false)}
        slots={weeklySlots}
        title={`${user?.name || 'Faculty'} Monthly Teaching Routine`}
        subtitle="Faculty Duty Schedule"
      />
    </div>
  );
};

export default TeacherTimetablePage;
