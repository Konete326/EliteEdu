import { useState, useEffect } from 'react';
import { Calendar, Clock, Printer, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import TeacherLiveStatusBanner from '../../components/teacher/timetable/TeacherLiveStatusBanner';
import TeacherDayTimeline from '../../components/teacher/timetable/TeacherDayTimeline';
import TimetableMatrixGrid from '../../components/admin/timetable/TimetableMatrixGrid';
import TimetablePrintModal from '../../components/admin/timetable/TimetablePrintModal';

const TeacherTimetablePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('today');
  const [selectedDay, setSelectedDay] = useState('');
  const [scheduleData, setScheduleData] = useState(null);
  const [weeklySlots, setWeeklySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrint, setShowPrint] = useState(false);

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

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDailySchedule(), fetchWeeklySlots()]).finally(() => setLoading(false));
  }, []);

  const handleSelectDay = (day) => { setSelectedDay(day); fetchDailySchedule(day); };

  if (loading) {
    return <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  const { bellSchedule, periodTimeline, currentSlot, nextSlot, day_of_week } = scheduleData || {};

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" /> Faculty Timetable & Live Bell Schedule
          </h1>
          <p className="text-xs text-gray-500">Track current period classes, breaks, and your full weekly teaching roster</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl flex border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'today' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Live Today
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'weekly' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Weekly Grid
            </button>
          </div>
          <button
            onClick={() => setShowPrint(true)}
            className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 border border-blue-200 dark:border-blue-800/40"
          >
            <Printer className="w-3.5 h-3.5" /> Print A4
          </button>
        </div>
      </div>

      {activeTab === 'today' ? (
        <div className="space-y-6">
          <TeacherLiveStatusBanner currentSlot={currentSlot} nextSlot={nextSlot} bellSchedule={bellSchedule} />
          <TeacherDayTimeline
            selectedDay={selectedDay || day_of_week || 'Monday'}
            onSelectDay={handleSelectDay}
            timeline={periodTimeline || []}
            todayDay={day_of_week}
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

      <TimetablePrintModal
        isOpen={showPrint}
        onClose={() => setShowPrint(false)}
        slots={weeklySlots}
        title={`${user?.name || 'Faculty'} Weekly Teaching Routine`}
      />
    </div>
  );
};

export default TeacherTimetablePage;
