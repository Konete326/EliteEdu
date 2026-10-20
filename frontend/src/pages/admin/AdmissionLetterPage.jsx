import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdmissionStudentSelector from '../../components/admin/students/admission/AdmissionStudentSelector';
import AdmissionFormDocument from '../../components/admin/students/admission/AdmissionFormDocument';
import AdmissionQuickEditModal from '../../components/admin/students/admission/AdmissionQuickEditModal';
import api from '../../services/api';

const studentsPageCache = new Map();

const AdmissionLetterPage = () => {
  const [searchParams] = useSearchParams();
  const urlStudentId = searchParams.get('studentId');

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const selectedStudentRef = useRef(null);
  selectedStudentRef.current = selectedStudent;

  const [campuses, setCampuses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    Promise.all([api.get('/campuses'), api.get('/grades')])
      .then(([cRes, gRes]) => {
        if (cRes.data?.campuses) setCampuses(cRes.data.campuses);
        if (gRes.data?.grades) setGrades(gRes.data.grades);
      }).catch(() => {});
  }, []);

  const loadStudentDetails = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await api.get(`/students/${id}`);
      if (res.data?.student) setSelectedStudent(res.data.student);
    } catch {}
  }, []);

  useEffect(() => {
    if (urlStudentId) loadStudentDetails(urlStudentId);
  }, [urlStudentId, loadStudentDetails]);

  useEffect(() => {
    let active = true;
    const cacheKey = `${currentPage}_${debouncedSearch}_${selectedCampus}_${selectedGrade}`;

    if (studentsPageCache.has(cacheKey)) {
      const cached = studentsPageCache.get(cacheKey);
      setStudents(cached.students);
      setTotalPages(cached.totalPages);
      if (!selectedStudentRef.current && !urlStudentId && cached.students.length > 0) {
        loadStudentDetails(cached.students[0]._id);
      }
      return;
    }

    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage, limit: 12, search: debouncedSearch,
      campus_id: selectedCampus, grade_id: selectedGrade, minimal: 'true'
    });

    api.get(`/students?${params.toString()}`)
      .then((res) => {
        if (!active) return;
        const list = res.data?.students || [];
        const pages = res.data?.totalPages || 1;
        studentsPageCache.set(cacheKey, { students: list, totalPages: pages });
        setStudents(list);
        setTotalPages(pages);
        if (!selectedStudentRef.current && !urlStudentId && list.length > 0) {
          loadStudentDetails(list[0]._id);
        }
      }).catch(() => {}).finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [currentPage, debouncedSearch, selectedCampus, selectedGrade, urlStudentId, loadStudentDetails]);

  const handleSelectStudent = (student) => {
    if (!student?._id) return;
    setSelectedStudent(student);
    loadStudentDetails(student._id);
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-4 print:hidden">
          <AdmissionStudentSelector
            students={students} selectedStudent={selectedStudent} onSelectStudent={handleSelectStudent}
            searchQuery={searchQuery} onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
            campuses={campuses} selectedCampus={selectedCampus} onCampusChange={(c) => { setSelectedCampus(c); setCurrentPage(1); }}
            grades={grades} selectedGrade={selectedGrade} onGradeChange={(g) => { setSelectedGrade(g); setCurrentPage(1); }}
            currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} loading={loading}
          />
        </div>
        <div className="xl:col-span-8 min-w-0">
          <AdmissionFormDocument student={selectedStudent} onQuickEditClick={() => setIsEditOpen(true)} />
        </div>
      </div>
      <AdmissionQuickEditModal
        isOpen={isEditOpen} student={selectedStudent} onClose={() => setIsEditOpen(false)}
        onSuccess={(updated) => setSelectedStudent(updated)}
      />
    </div>
  );
};

export default AdmissionLetterPage;
