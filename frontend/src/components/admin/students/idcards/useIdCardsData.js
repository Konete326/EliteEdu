import { useState, useEffect, useMemo } from 'react';
import api from '../../../../services/api';

export const useIdCardsData = (initialStudentId) => {
  const [students, setStudents] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.get('/students?limit=200'),
      api.get('/campuses'),
      api.get('/grades')
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

  return {
    campuses,
    grades,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCampus,
    setSelectedCampus,
    selectedGrade,
    setSelectedGrade,
    selectedIds,
    filteredStudents,
    selectedStudents,
    chunks,
    handleToggleSelect,
    handleToggleSelectAll
  };
};
