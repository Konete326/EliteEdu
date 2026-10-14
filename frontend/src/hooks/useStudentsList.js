import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useStudentsList = () => {
  const [students, setStudents] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
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
        api.get('/campuses'),
        api.get('/grades')
      ]);
      setCampuses(campusesRes.data.campuses || []);
      setGrades(gradesRes.data.grades || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit,
        search: searchQuery
      };
      if (selectedCampus !== 'all') params.campus_id = selectedCampus;
      if (selectedGrade !== 'all') params.grade_id = selectedGrade;

      const res = await api.get('/students', { params });
      setStudents(res.data.students || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalStudents(res.data.pagination?.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedCampus, selectedGrade, searchQuery]);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Left' : 'Active';
    setStudents((prev) =>
      prev.map((s) => (s._id === id ? { ...s, status: nextStatus } : s))
    );
    try {
      await api.patch(`/students/${id}/status`, { status: nextStatus });
    } catch (err) {
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: currentStatus } : s))
      );
      setError(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete?._id) return;
    try {
      setDeleteLoading(true);
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
    setSelectedCampus: (c) => { setSelectedCampus(c); setPage(1); },
    selectedGrade,
    setSelectedGrade: (g) => { setSelectedGrade(g); setPage(1); },
    searchQuery,
    setSearchQuery: (q) => { setSearchQuery(q); setPage(1); },
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
    refreshStudents: fetchStudents
  };
};
