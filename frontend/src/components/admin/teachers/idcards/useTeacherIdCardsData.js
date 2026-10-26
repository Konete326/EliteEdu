import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../../../../services/api';

export const useTeacherIdCardsData = (initialTeacherId) => {
  const [teachers, setTeachers] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedIds, setSelectedIds] = useState(initialTeacherId ? [initialTeacherId] : []);
  const [isAllSelected, setIsAllSelected] = useState(!initialTeacherId);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const params = { cardView: 'true' };
      if (selectedCampus) params.campus_id = selectedCampus;
      if (searchQuery && searchQuery.trim()) params.search = searchQuery.trim();

      const [tRes, cRes] = await Promise.all([
        api.get('/teachers', { params }),
        api.get('/campuses')
      ]);

      const list = tRes.data?.teachers || tRes.data || [];
      setTeachers(list);
      setCampuses(cRes.data?.campuses || cRes.data || []);

      if (initialTeacherId) {
        setSelectedIds([initialTeacherId]);
        setIsAllSelected(false);
      } else if (isAllSelected) {
        setSelectedIds(list.map((t) => t._id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedCampus, searchQuery, initialTeacherId, isAllSelected]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTeachers();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchTeachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      if (selectedCampus && t.campus_id?._id !== selectedCampus && t.campus_id !== selectedCampus) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.name?.toLowerCase().includes(q) ||
        t.employee_code?.toLowerCase().includes(q) ||
        t.personal_id?.toLowerCase().includes(q) ||
        t.cnic?.toLowerCase().includes(q) ||
        t.designation?.toLowerCase().includes(q)
      );
    });
  }, [teachers, selectedCampus, searchQuery]);

  const selectedTeachers = useMemo(() => {
    if (isAllSelected) return filteredTeachers;
    const set = new Set(selectedIds);
    return filteredTeachers.filter((t) => set.has(t._id));
  }, [filteredTeachers, selectedIds, isAllSelected]);

  const handleToggleSelect = (id) => {
    if (isAllSelected) {
      setIsAllSelected(false);
      setSelectedIds(filteredTeachers.filter((t) => t._id !== id).map((t) => t._id));
    } else {
      setSelectedIds((prev) => {
        const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
        if (next.length === filteredTeachers.length && filteredTeachers.length > 0) {
          setIsAllSelected(true);
        }
        return next;
      });
    }
  };

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setIsAllSelected(false);
      setSelectedIds([]);
    } else {
      setIsAllSelected(true);
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
    setSelectedIds,
    filteredTeachers,
    selectedTeachers,
    handleToggleSelect,
    handleToggleSelectAll,
    updateTeacherInList,
    isAllSelected,
    totalCount: filteredTeachers.length,
    selectedCount: isAllSelected ? filteredTeachers.length : selectedIds.length
  };
};
