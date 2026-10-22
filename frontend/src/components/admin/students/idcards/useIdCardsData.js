import { useState, useEffect, useMemo } from 'react';
import api from '../../../../services/api';

let cachedCampuses = null;
let cachedGrades = null;

export const useIdCardsData = (initialStudentId) => {
  const [students, setStudents] = useState([]);
  const [campuses, setCampuses] = useState(cachedCampuses || []);
  const [grades, setGrades] = useState(cachedGrades || []);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [photoFilter, setPhotoFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState(initialStudentId ? [initialStudentId] : []);

  useEffect(() => {
    let isMounted = true;

    if (initialStudentId) {
      api.get(`/students/${initialStudentId}`).then((res) => {
        if (!isMounted) return;
        const student = res.data?.student || res.data;
        if (student) {
          setStudents((prev) => {
            if (prev.some((s) => s._id === student._id)) return prev;
            return [student, ...prev];
          });
          setSelectedIds([student._id]);
          setLoading(false);
        }
      }).catch(() => {});
    }

    Promise.all([
      api.get('/students?cardView=true&limit=1000'),
      cachedCampuses ? Promise.resolve({ data: { campuses: cachedCampuses } }) : api.get('/campuses'),
      cachedGrades ? Promise.resolve({ data: { grades: cachedGrades } }) : api.get('/grades'),
    ]).then(([sRes, cRes, gRes]) => {
      if (!isMounted) return;
      const list = sRes.data?.students || sRes.data || [];
      cachedCampuses = cRes.data?.campuses || cRes.data || [];
      cachedGrades = gRes.data?.grades || gRes.data || [];

      setCampuses(cachedCampuses);
      setGrades(cachedGrades);

      setStudents((prev) => {
        if (!prev.length) return list;
        const existingIds = new Set(list.map((item) => item._id));
        const prepended = prev.filter((p) => !existingIds.has(p._id));
        return [...prepended, ...list];
      });

      if (!initialStudentId) {
        setSelectedIds(list.map((s) => s._id));
      }
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [initialStudentId]);

  const photoCounts = useMemo(() => {
    let withPhoto = 0;
    let withoutPhoto = 0;
    students.forEach((s) => {
      if (s.photo_url && String(s.photo_url).trim()) withPhoto++;
      else withoutPhoto++;
    });
    return { withPhoto, withoutPhoto, total: students.length };
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (selectedCampus && s.campus_id?._id !== selectedCampus && s.campus_id !== selectedCampus) return false;
      if (selectedGrade && s.current_grade?._id !== selectedGrade && s.current_grade !== selectedGrade) return false;
      if (photoFilter === 'with_photo' && (!s.photo_url || !String(s.photo_url).trim())) return false;
      if (photoFilter === 'without_photo' && s.photo_url && String(s.photo_url).trim()) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name?.toLowerCase().includes(q) ||
        s.gr_number?.toLowerCase().includes(q) ||
        s.father_name?.toLowerCase().includes(q)
      );
    });
  }, [students, selectedCampus, selectedGrade, photoFilter, searchQuery]);

  const selectedStudents = useMemo(() => {
    return filteredStudents.filter((s) => selectedIds.includes(s._id));
  }, [filteredStudents, selectedIds]);

  const handlePhotoFilterChange = (filter) => {
    setPhotoFilter(filter);
    const nextFiltered = students.filter((s) => {
      if (selectedCampus && s.campus_id?._id !== selectedCampus && s.campus_id !== selectedCampus) return false;
      if (selectedGrade && s.current_grade?._id !== selectedGrade && s.current_grade !== selectedGrade) return false;
      if (filter === 'with_photo' && (!s.photo_url || !String(s.photo_url).trim())) return false;
      if (filter === 'without_photo' && s.photo_url && String(s.photo_url).trim()) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name?.toLowerCase().includes(q) ||
        s.gr_number?.toLowerCase().includes(q) ||
        s.father_name?.toLowerCase().includes(q)
      );
    });
    setSelectedIds(nextFiltered.map((s) => s._id));
  };

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

  const updateStudentInList = (updatedStudent) => {
    setStudents((prev) => prev.map((s) => (s._id === updatedStudent._id ? { ...s, ...updatedStudent } : s)));
  };

  return {
    students,
    campuses,
    grades,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCampus,
    setSelectedCampus,
    selectedGrade,
    setSelectedGrade,
    photoFilter,
    setPhotoFilter,
    handlePhotoFilterChange,
    photoCounts,
    selectedIds,
    setSelectedIds,
    filteredStudents,
    selectedStudents,
    handleToggleSelect,
    handleToggleSelectAll,
    updateStudentInList,
  };
};
