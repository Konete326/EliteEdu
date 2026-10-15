import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import IdCardsToolbar from '../../components/admin/students/idcards/IdCardsToolbar';
import IdCardsSheetPage from '../../components/admin/students/idcards/IdCardsSheetPage';
import IdCardCustomizeModal from '../../components/admin/students/idcards/IdCardCustomizeModal';

const StudentIdCardsPage = () => {
  const [searchParams] = useSearchParams();
  const initialStudentId = searchParams.get('studentId');

  const [students, setStudents] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStyle, setSelectedStyle] = useState('Default');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  const [config, setConfig] = useState({
    motto: 'پڑھے گا سندھ بڑھے گا سندھ',
    accentColor: '#3b82f6',
    showBarcode: true,
    showQr: true,
    showBloodGroup: true,
    showMotto: true
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      axios.get('/api/students?limit=200'),
      axios.get('/api/campuses'),
      axios.get('/api/grades')
    ]).then(([sRes, cRes, gRes]) => {
      if (!isMounted) return;
      const list = sRes.data.students || sRes.data || [];
      setStudents(list);
      setCampuses(cRes.data.campuses || cRes.data || []);
      setGrades(gRes.data.grades || gRes.data || []);
      if (initialStudentId) {
        setSelectedIds([initialStudentId]);
      } else {
        setSelectedIds(list.map((s) => s._id));
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [initialStudentId]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (selectedCampus && s.campus_id?._id !== selectedCampus && s.campus_id !== selectedCampus) return false;
      if (selectedGrade && s.current_grade?._id !== selectedGrade && s.current_grade !== selectedGrade) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name?.toLowerCase().includes(q) ||
        s.gr_number?.toLowerCase().includes(q) ||
        s.father_name?.toLowerCase().includes(q)
      );
    });
  }, [students, selectedCampus, selectedGrade, searchQuery]);

  const selectedStudents = useMemo(() => {
    return filteredStudents.filter((s) => selectedIds.includes(s._id));
  }, [filteredStudents, selectedIds]);

  const chunks = useMemo(() => {
    const res = [];
    for (let i = 0; i < selectedStudents.length; i += 8) {
      res.push(selectedStudents.slice(i, i + 8));
    }
    return res;
  }, [selectedStudents]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s._id));
    }
  };

  return (
    <div className="space-y-6">
      <IdCardsToolbar
        selectedStyle={selectedStyle}
        onSelectStyle={setSelectedStyle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        campuses={campuses}
        selectedCampus={selectedCampus}
        onCampusChange={setSelectedCampus}
        grades={grades}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        selectedCount={selectedStudents.length}
        totalCount={filteredStudents.length}
        onToggleSelectAll={handleToggleSelectAll}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
      />

      <IdCardCustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        config={config}
        onConfigChange={setConfig}
      />

      {loading ? (
        <div className="text-center py-16 text-xs text-ink-muted">Loading student directory & generating cards...</div>
      ) : chunks.length === 0 ? (
        <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-12 text-center text-xs text-ink-muted">
          No students selected or found matching criteria.
        </div>
      ) : (
        <div className="space-y-8">
          {chunks.map((chunk, idx) => (
            <IdCardsSheetPage
              key={idx}
              students={chunk}
              pageIndex={idx}
              totalSheets={chunks.length}
              selectedStyle={selectedStyle}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              config={config}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentIdCardsPage;
