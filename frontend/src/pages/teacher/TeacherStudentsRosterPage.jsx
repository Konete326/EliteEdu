import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import TeacherStudentProfileModal from '../../components/teacher/TeacherStudentProfileModal';
import TeacherRosterToolbar from '../../components/teacher/students/TeacherRosterToolbar';
import TeacherStudentTable from '../../components/teacher/students/TeacherStudentTable';

const TeacherStudentsRosterPage = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const fetchRoster = () => {
    Promise.all([api.get('/teacher-portal/my-students'), api.get('/teacher-portal/me')])
      .then(([studentsRes, meRes]) => {
        setStudents(studentsRes.data?.students || []);
        const teacherGrades = meRes.data?.teacher?.grades || [];
        const ctGrades = meRes.data?.class_teacher_grades || [];
        const combined = [...ctGrades, ...teacherGrades];
        const unique = Array.from(new Map(combined.map((g) => [String(g._id), g])).values());
        setGrades(unique);
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRoster(); }, []);

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
  const filtered = students.filter((s) => {
    const q = search.toLowerCase().trim();
    const matchQ = !q || s.name?.toLowerCase().includes(q) || s.father_name?.toLowerCase().includes(q) || s.gr_number?.toLowerCase().includes(q);
    const matchSec = selectedSection === 'All' || s.current_section === selectedSection;
    return matchQ && matchSec;
  });

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
        onAddStudent={() => { setActiveStudent(null); setModalOpen(true); }}
        onAttendanceClick={() => navigate('/teacher/attendance')}
      />

      <TeacherStudentTable
        loading={loading}
        students={filtered}
        onEdit={(s) => { setActiveStudent(s); setModalOpen(true); }}
        onView={(s) => { setActiveStudent(s); setModalOpen(true); }}
      />

      <TeacherStudentProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={activeStudent}
        grades={grades}
        onSaved={handleSaved}
      />
    </div>
  );
};

export default TeacherStudentsRosterPage;
