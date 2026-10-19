import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCampus } from '../../context/CampusContext';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import PrerequisiteGuardBanner from '../../components/common/PrerequisiteGuardBanner';
import TimetableHeaderBar from '../../components/admin/timetable/TimetableHeaderBar';
import BellScheduleConfigCard from '../../components/admin/timetable/BellScheduleConfigCard';
import BellScheduleSlotTable from '../../components/admin/timetable/BellScheduleSlotTable';
import TimetableFilterBar from '../../components/admin/timetable/TimetableFilterBar';
import TimetableMatrixGrid from '../../components/admin/timetable/TimetableMatrixGrid';
import TimetableSlotAssignModal from '../../components/admin/timetable/TimetableSlotAssignModal';
import TimetablePrintModal from '../../components/admin/timetable/TimetablePrintModal';
import TimetableSubstitutionTab from '../../components/admin/timetable/TimetableSubstitutionTab';

const TimetablePage = () => {
  const { user } = useAuth();
  const { selectedCampus } = useCampus();
  const { showToast } = useToast();
  const [activeMode, setActiveMode] = useState('class');
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bellSchedule, setBellSchedule] = useState(null);
  const [previewSlots, setPreviewSlots] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [assignModal, setAssignModal] = useState({ open: false, data: {} });
  const [showPrint, setShowPrint] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/grades'), api.get('/subjects'), api.get('/teachers'), api.get('/timetable/bell-schedule')]).then(
      ([gRes, sRes, tRes, bRes]) => {
        const gList = gRes.data?.grades || gRes.data || [];
        const tList = tRes.data?.teachers || tRes.data || [];
        setGrades(gList);
        setSubjects(sRes.data?.subjects || sRes.data || []);
        setTeachers(tList);
        if (gList.length) setSelectedGrade(gList[0]._id);
        if (tList.length) setSelectedTeacher(tList[0]._id);
        if (bRes.data?.schedule) {
          setBellSchedule(bRes.data.schedule);
          setPreviewSlots(bRes.data.schedule.slots || []);
        }
      }
    ).catch(() => {});
  }, [selectedCampus]);

  const loadSlots = async () => {
    setLoading(true);
    try {
      let q = selectedCampus ? `?campus_id=${selectedCampus}` : '?';
      if (activeMode === 'class' && selectedGrade) q += `&grade_id=${selectedGrade}&section=${selectedSection}`;
      if (activeMode === 'teacher' && selectedTeacher) q += `&teacher_id=${selectedTeacher}`;
      const res = await api.get(`/timetable${q}`);
      setSlots(res.data?.slots || []);
      if (res.data?.bellSchedule) setBellSchedule(res.data.bellSchedule);
    } catch {
      showToast('Failed to load timetable', 'error');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (activeMode !== 'substitutions') loadSlots(); }, [activeMode, selectedGrade, selectedSection, selectedTeacher, selectedCampus]);

  const handleDeleteSlot = async (id) => {
    try {
      await api.delete(`/timetable/${id}`);
      showToast('Period slot deleted', 'success');
      loadSlots();
    } catch { showToast('Failed to delete slot', 'error'); }
  };

  const openAssignModal = (day = 'Monday', pNo = 1, pData = {}) => {
    setAssignModal({
      open: true,
      data: {
        day_of_week: day, period_no: pNo, start_time: pData.start_time, end_time: pData.end_time,
        grade_id: selectedGrade, section: selectedSection, teacher_id: activeMode === 'teacher' ? selectedTeacher : ''
      }
    });
  };

  return (
    <div className="w-full space-y-6">
      <TimetableHeaderBar activeMode={activeMode} onChangeMode={setActiveMode} onPrint={() => setShowPrint(true)} />
      <PrerequisiteGuardBanner prerequisites={[
        { label: 'Classes / Grades', count: grades.length, link: '/admin/grades' },
        { label: 'Subjects', count: subjects.length, link: '/admin/subjects' },
        { label: 'Teachers', count: teachers.length, link: '/admin/teachers' }
      ]} />
      {activeMode === 'timings' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7"><BellScheduleConfigCard schedule={bellSchedule} onSaved={(s) => { setBellSchedule(s); setPreviewSlots(s.slots || []); }} onSlotsPreview={setPreviewSlots} /></div>
          <div className="lg:col-span-5"><BellScheduleSlotTable slots={previewSlots} /></div>
        </div>
      ) : activeMode === 'substitutions' ? (
        <TimetableSubstitutionTab campusId={selectedCampus} />
      ) : (
        <div className="space-y-4">
          <TimetableFilterBar viewMode={activeMode} grades={grades} teachers={teachers} selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} selectedSection={selectedSection} setSelectedSection={setSelectedSection} selectedTeacher={selectedTeacher} setSelectedTeacher={setSelectedTeacher} onOpenAssign={() => openAssignModal()} />
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : (
            <TimetableMatrixGrid slots={slots} viewMode={activeMode} bellSchedule={bellSchedule} onOpenAssign={(day, p, pData) => openAssignModal(day, p, pData)} onDeleteSlot={handleDeleteSlot} canManage={user?.role !== 'Teacher'} />
          )}
        </div>
      )}
      <TimetableSlotAssignModal isOpen={assignModal.open} onClose={() => setAssignModal({ open: false, data: {} })} initialData={assignModal.data} grades={grades} subjects={subjects} teachers={teachers} bellSchedule={bellSchedule} onSaved={loadSlots} />
      <TimetablePrintModal isOpen={showPrint} onClose={() => setShowPrint(false)} slots={slots} title={activeMode === 'class' ? `${grades.find((g) => g._id === selectedGrade)?.name || 'Class'} (${selectedSection}) Timetable` : `${teachers.find((t) => t._id === selectedTeacher)?.name || 'Teacher'} Routine`} />
    </div>
  );
};

export default TimetablePage;
