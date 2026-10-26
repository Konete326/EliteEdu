import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../../../../services/api';

let cachedCampuses = null;
let cachedGrades = null;

export const useIdCardsData = (initialStudentId) => {
  const [students, setStudents] = useState([]);
  const [campuses, setCampuses] = useState(cachedCampuses || []);
  const [grades, setGrades] = useState(cachedGrades || []);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [photoFilter, setPhotoFilter] = useState('all');
  const [isAllSelected, setIsAllSelected] = useState(!initialStudentId);
  const [selectedIds, setSelectedIds] = useState(initialStudentId ? [initialStudentId] : []);

  const fetchPreviewStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        cardView: 'true',
        limit: 36
      };
      if (selectedCampus) params.campus_id = selectedCampus;
      if (selectedGrade) params.grade_id = selectedGrade;
      if (searchQuery && searchQuery.trim()) params.search = searchQuery.trim();

      const [sRes, cRes, gRes] = await Promise.all([
        api.get('/students', { params }),
        cachedCampuses ? Promise.resolve({ data: { campuses: cachedCampuses } }) : api.get('/campuses'),
        cachedGrades ? Promise.resolve({ data: { grades: cachedGrades } }) : api.get('/grades')
      ]);

      const list = sRes.data?.students || sRes.data || [];
      const total = sRes.data?.totalCount || sRes.data?.pagination?.total || list.length;
      cachedCampuses = cRes.data?.campuses || cRes.data || [];
      cachedGrades = gRes.data?.grades || gRes.data || [];

      setCampuses(cachedCampuses);
      setGrades(cachedGrades);
      setStudents(list);
      setTotalCount(total);

      if (initialStudentId && !list.some((s) => s._id === initialStudentId)) {
        try {
          const singleRes = await api.get(`/students/${initialStudentId}`);
          const single = singleRes.data?.student || singleRes.data;
          if (single) {
            setStudents((prev) => [single, ...prev]);
            setSelectedIds([single._id]);
            setIsAllSelected(false);
          }
        } catch {}
      } else if (!initialStudentId && isAllSelected) {
        setSelectedIds(list.map((s) => s._id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedCampus, selectedGrade, searchQuery, initialStudentId, isAllSelected]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPreviewStudents();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchPreviewStudents]);

  const photoCounts = useMemo(() => {
    let withPhoto = 0;
    let withoutPhoto = 0;
    students.forEach((s) => {
      if (s.photo_url && String(s.photo_url).trim()) withPhoto++;
      else withoutPhoto++;
    });
    return { withPhoto, withoutPhoto, total: totalCount || students.length };
  }, [students, totalCount]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (photoFilter === 'with_photo' && (!s.photo_url || !String(s.photo_url).trim())) return false;
      if (photoFilter === 'without_photo' && s.photo_url && String(s.photo_url).trim()) return false;
      return true;
    });
  }, [students, photoFilter]);

  const selectedStudents = useMemo(() => {
    if (isAllSelected) return filteredStudents;
    const set = new Set(selectedIds);
    return filteredStudents.filter((s) => set.has(s._id));
  }, [filteredStudents, selectedIds, isAllSelected]);

  const handlePhotoFilterChange = (filter) => {
    setPhotoFilter(filter);
  };

  const handleToggleSelect = (id) => {
    if (isAllSelected) {
      setIsAllSelected(false);
      setSelectedIds(filteredStudents.filter((s) => s._id !== id).map((s) => s._id));
    } else {
      setSelectedIds((prev) => {
        const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
        if (next.length === totalCount && totalCount > 0) {
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
    totalCount,
    isAllSelected,
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
    selectedCount: isAllSelected ? (totalCount || filteredStudents.length) : selectedIds.length
  };
};
