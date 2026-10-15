import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdmissionStudentSelector from '../../components/admin/students/admission/AdmissionStudentSelector';
import AdmissionFormDocument from '../../components/admin/students/admission/AdmissionFormDocument';
import AdmissionQuickEditModal from '../../components/admin/students/admission/AdmissionQuickEditModal';
import api from '../../services/api';

const AdmissionLetterPage = () => {
  const [searchParams] = useSearchParams();
  const urlStudentId = searchParams.get('studentId');

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [campuses, setCampuses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchFilters = useCallback(async () => {
    try {
      const [cRes, gRes] = await Promise.all([api.get('/campuses'), api.get('/grades')]);
      if (cRes.data?.campuses) setCampuses(cRes.data.campuses);
      if (gRes.data?.grades) setGrades(gRes.data.grades);
    } catch {}
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        search: searchQuery,
        campus_id: selectedCampus,
        grade_id: selectedGrade
      });
      const res = await api.get(`/students?${params.toString()}`);
      if (res.data?.students) {
        setStudents(res.data.students);
        setTotalPages(res.data.totalPages || 1);
        if (!selectedStudent && res.data.students.length > 0 && !urlStudentId) {
          setSelectedStudent(res.data.students[0]);
        }
      }
    } catch {} finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCampus, selectedGrade, selectedStudent, urlStudentId]);

  useEffect(() => { fetchFilters(); }, [fetchFilters]);
  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  useEffect(() => {
    if (urlStudentId) {
      api.get(`/students/${urlStudentId}`)
        .then((res) => { if (res.data?.student) setSelectedStudent(res.data.student); })
        .catch(() => {});
    }
  }, [urlStudentId]);

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-4 print:hidden">
          <AdmissionStudentSelector
            students={students}
            selectedStudent={selectedStudent}
            onSelectStudent={setSelectedStudent}
            searchQuery={searchQuery}
            onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
            campuses={campuses}
            selectedCampus={selectedCampus}
            onCampusChange={(c) => { setSelectedCampus(c); setCurrentPage(1); }}
            grades={grades}
            selectedGrade={selectedGrade}
            onGradeChange={(g) => { setSelectedGrade(g); setCurrentPage(1); }}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            loading={loading}
          />
        </div>

        <div className="xl:col-span-8 min-w-0">
          <AdmissionFormDocument
            student={selectedStudent}
            onQuickEditClick={() => setIsEditOpen(true)}
          />
        </div>
      </div>

      <AdmissionQuickEditModal
        isOpen={isEditOpen}
        student={selectedStudent}
        onClose={() => setIsEditOpen(false)}
        onSuccess={(updated) => setSelectedStudent(updated)}
      />
    </div>
  );
};

export default AdmissionLetterPage;
