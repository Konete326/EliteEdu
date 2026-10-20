import { useState, useEffect, useMemo } from 'react';
import api from '../../../../services/api';

export const useTeacherIdCardsData = (initialTeacherId) => {
  const [teachers, setTeachers] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.get('/teachers?cardView=true'),
      api.get('/campuses')
    ])
      .then(([tRes, cRes]) => {
        if (!isMounted) return;
        const list = tRes.data.teachers || tRes.data || [];
        setTeachers(list);
        setCampuses(cRes.data.campuses || cRes.data || []);
        if (initialTeacherId) {
          setSelectedIds([initialTeacherId]);
        } else {
          setSelectedIds(list.map((t) => t._id));
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [initialTeacherId]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      if (selectedCampus && t.campus_id?._id !== selectedCampus && t.campus_id !== selectedCampus) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.name?.toLowerCase().includes(q) ||
        t.employee_code?.toLowerCase().includes(q) ||
        t.personal_id?.toLowerCase().includes(q) ||
        t.cnic?.toLowerCase().includes(q)
      );
    });
  }, [teachers, selectedCampus, searchQuery]);

  const selectedTeachers = useMemo(() => {
    return filteredTeachers.filter((t) => selectedIds.includes(t._id));
  }, [filteredTeachers, selectedIds]);

  const chunks = useMemo(() => {
    const res = [];
    for (let i = 0; i < selectedTeachers.length; i += 8) {
      res.push(selectedTeachers.slice(i, i + 8));
    }
    return res;
  }, [selectedTeachers]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredTeachers.length && filteredTeachers.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTeachers.map((t) => t._id));
    }
  };

  const updateTeacherInList = (updatedTeacher) => {
    setTeachers((prev) => prev.map((t) => (t._id === updatedTeacher._id ? { ...t, ...updatedTeacher } : t)));
  };

  return {
    teachers,
    campuses,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCampus,
    setSelectedCampus,
    selectedIds,
    filteredTeachers,
    selectedTeachers,
    chunks,
    handleToggleSelect,
    handleToggleSelectAll,
    updateTeacherInList
  };
};
