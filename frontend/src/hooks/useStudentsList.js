import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

let cachedCampuses = null;
let cachedGrades = null;
const studentCache = new Map();

export const useStudentsList = () => {
  const [students, setStudents] = useState([]);
  const [campuses, setCampuses] = useState(cachedCampuses || []);
  const [grades, setGrades] = useState(cachedGrades || []);
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [kpis, setKpis] = useState({ total: 0, active: 0, left: 0, withDiscount: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(!studentCache.size);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [viewStudent, setViewStudent] = useState(null);
  const [ledgerStudent, setLedgerStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchFilters = async () => {
    try {
      const [campusesRes, gradesRes] = await Promise.all([
        cachedCampuses ? Promise.resolve({ data: { campuses: cachedCampuses } }) : api.get('/campuses'),
        cachedGrades ? Promise.resolve({ data: { grades: cachedGrades } }) : api.get('/grades'),
      ]);
      cachedCampuses = campusesRes.data.campuses || [];
      cachedGrades = gradesRes.data.grades || [];
      setCampuses(cachedCampuses);
      setGrades(cachedGrades);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = useCallback(async () => {
    const cacheKey = `${selectedCampus}_${selectedGrade}_${selectedStatus}_${searchQuery}_${page}_${limit}`;
    const cached = studentCache.get(cacheKey);

    if (cached) {
      setStudents(cached.students);
      setTotalPages(cached.totalPages);
      setTotalStudents(cached.totalStudents);
      if (cached.kpis) setKpis(cached.kpis);
      setLoading(false);
    } else {
      setLoading(true);
    }

    try {
      setError('');
      const params = { page, limit, search: searchQuery };
      if (selectedCampus !== 'all') params.campus_id = selectedCampus;
      if (selectedGrade !== 'all') params.grade_id = selectedGrade;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      const res = await api.get('/students', { params });
      const nextStudents = res.data.students || [];
      const total = res.data.totalCount ?? res.data.pagination?.total ?? res.data.total ?? 0;
      const pages = res.data.totalPages ?? res.data.pagination?.totalPages ?? 1;
      const nextKpis = res.data.kpis || { total, active: 0, left: 0, withDiscount: 0 };

      studentCache.set(cacheKey, { students: nextStudents, totalPages: pages, totalStudents: total, kpis: nextKpis });
      setStudents(nextStudents);
      setTotalPages(pages);
      setTotalStudents(total);
      if (res.data.kpis) setKpis(res.data.kpis);
    } catch (err) {
      if (!cached) {
        setError(err.response?.data?.message || 'Failed to load students');
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedCampus, selectedGrade, selectedStatus, searchQuery]);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      fetchStudents();
      return;
    }
    const timer = setTimeout(() => {
      fetchStudents();
    }, 350);
    return () => clearTimeout(timer);
  }, [fetchStudents, searchQuery]);

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Left' : 'Active';
    studentCache.clear();
    setStudents((prev) => prev.map((s) => (s._id === id ? { ...s, status: nextStatus } : s)));
    try {
      await api.patch(`/students/${id}/status`, { status: nextStatus });
    } catch (err) {
      studentCache.clear();
      setStudents((prev) => prev.map((s) => (s._id === id ? { ...s, status: currentStatus } : s)));
      setError(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete?._id) return;
    try {
      setDeleteLoading(true);
      studentCache.clear();
      await api.delete(`/students/${studentToDelete._id}`);
      setStudentToDelete(null);
      await fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete student');
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    students,
    campuses,
    grades,
    selectedCampus,
    setSelectedCampus: (c) => {
      setSelectedCampus(c);
      setPage(1);
    },
    selectedGrade,
    setSelectedGrade: (g) => {
      setSelectedGrade(g);
      setPage(1);
    },
    selectedStatus,
    setSelectedStatus: (s) => {
      setSelectedStatus(s);
      setPage(1);
    },
    kpis,
    searchQuery,
    setSearchQuery: (q) => {
      setSearchQuery(q);
      setPage(1);
    },
    loading,
    error,
    setError,
    page,
    setPage,
    limit,
    totalPages,
    totalStudents,
    viewStudent,
    setViewStudent,
    ledgerStudent,
    setLedgerStudent,
    studentToDelete,
    setStudentToDelete,
    deleteLoading,
    handleToggleStatus,
    handleDeleteConfirm,
    refreshStudents: () => {
      studentCache.clear();
      return fetchStudents();
    },
  };
};
