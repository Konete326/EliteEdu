import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import TeacherStudentProfileModal from '../../components/teacher/TeacherStudentProfileModal';
import TeacherRosterToolbar from '../../components/teacher/students/TeacherRosterToolbar';
import TeacherStudentCardGrid from '../../components/teacher/students/TeacherStudentCardGrid';
import TeacherStudentTable from '../../components/teacher/students/TeacherStudentTable';

const BATCH_SIZE = 16;

const TeacherStudentsRosterPage = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [teacherCampusId, setTeacherCampusId] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const sentinelRef = useRef(null);

  const fetchRoster = () => {
    Promise.all([
      api.get('/teacher-portal/my-students'),
      api.get('/teacher-portal/me'),
      api.get('/campuses').catch(() => ({ data: { campuses: [] } })),
      api.get('/grades').catch(() => ({ data: { grades: [] } }))
    ])
      .then(([studentsRes, meRes, campusesRes, gradesRes]) => {
        setStudents(studentsRes.data?.students || []);
        const teacherGrades = meRes.data?.teacher?.grades || [];
        const ctGrades = meRes.data?.class_teacher_grades || [];
        const campusGrades = meRes.data?.campus_grades || [];
        const assignedGrades = meRes.data?.assigned_grades || [];
        const apiGrades = gradesRes.data?.grades || gradesRes.data || [];
        const assignedOnly = [...assignedGrades, ...ctGrades, ...teacherGrades];
        const combined = assignedOnly.length > 0 ? assignedOnly : [...campusGrades, ...apiGrades];
        const unique = Array.from(new Map(combined.map((g) => [String(g._id), g])).values());
        setGrades(unique);
        const camps = campusesRes.data?.campuses || campusesRes.data || [];
        setCampuses(camps);
        const tCamp = meRes.data?.teacher?.campus_id?._id || meRes.data?.teacher?.campus_id || '';
        setTeacherCampusId(String(tCamp));
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRoster(); }, []);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [search, selectedSection]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaved = (savedStudent, isEdit) => {
    if (isEdit) {
      setStudents((prev) => prev.map((s) => (s._id === savedStudent._id ? savedStudent : s)));
      showToast(`Student ${savedStudent.name} profile updated successfully.`);
    } else {
      setStudents((prev) => [savedStudent, ...prev]);
      showToast(`New student ${savedStudent.name} enrolled into your class.`);
    }
  };

  const sections = ['All', ...new Set(students.map((s) => s.current_section).filter(Boolean))];
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return students.filter((s) => {
      const matchQ =
        !q ||
        s.name?.toLowerCase().includes(q) ||
        s.father_name?.toLowerCase().includes(q) ||
        s.gr_number?.toLowerCase().includes(q);
      const matchSec = selectedSection === 'All' || s.current_section === selectedSection;
      return matchQ && matchSec;
    });
  }, [students, search, selectedSection]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length));
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [filtered.length, visibleCount]);

  const visibleStudents = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="w-full space-y-6">
      {toast && (
        <div className="p-3.5 rounded-2xl bg-good/10 text-good border border-good/20 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <TeacherRosterToolbar
        search={search}
        onSearchChange={setSearch}
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
        sections={sections}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={filtered.length}
        visibleCount={visibleStudents.length}
        onAddStudent={() => { setActiveStudent(null); setModalOpen(true); }}
        onAttendanceClick={() => navigate('/teacher/attendance')}
      />

      {viewMode === 'grid' ? (
        <TeacherStudentCardGrid
          students={visibleStudents}
          loading={loading}
          hasMore={hasMore}
          sentinelRef={sentinelRef}
          onEdit={(s) => { setActiveStudent(s); setModalOpen(true); }}
          onView={(s) => { setActiveStudent(s); setModalOpen(true); }}
        />
      ) : (
        <>
          <div className="block md:hidden">
            <TeacherStudentCardGrid
              students={visibleStudents}
              loading={loading}
              hasMore={hasMore}
              sentinelRef={sentinelRef}
              onEdit={(s) => { setActiveStudent(s); setModalOpen(true); }}
              onView={(s) => { setActiveStudent(s); setModalOpen(true); }}
            />
          </div>
          <div className="hidden md:block">
            <TeacherStudentTable
              loading={loading}
              students={visibleStudents}
              hasMore={hasMore}
              sentinelRef={sentinelRef}
              onEdit={(s) => { setActiveStudent(s); setModalOpen(true); }}
              onView={(s) => { setActiveStudent(s); setModalOpen(true); }}
            />
          </div>
        </>
      )}

      <TeacherStudentProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={activeStudent}
        grades={grades}
        campuses={campuses}
        defaultCampusId={teacherCampusId}
        onSaved={handleSaved}
      />
    </div>
  );
};

export default TeacherStudentsRosterPage;
