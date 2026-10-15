import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useStaffApplicantsList = () => {
  const [applicants, setApplicants] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [viewApplicant, setViewApplicant] = useState(null);
  const [applicantToDelete, setApplicantToDelete] = useState(null);
  const [applicantToConvert, setApplicantToConvert] = useState(null);
  const [applicantForSalary, setApplicantForSalary] = useState(null);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isMapView, setIsMapView] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        campus_id: selectedCampus !== 'all' ? selectedCampus : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        department: selectedDepartment !== 'all' ? selectedDepartment : undefined,
        availability: selectedAvailability !== 'all' ? selectedAvailability : undefined,
        search: searchQuery.trim() || undefined
      };

      const res = await axios.get('/api/staff-applicants', { headers, params });
      if (res.data.success) {
        setApplicants(res.data.applicants || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalApplicants(res.data.totalCount || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load staff applicants');
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedCampus, selectedStatus, selectedDepartment, selectedAvailability, searchQuery]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [campusRes, teacherRes] = await Promise.all([
          axios.get('/api/campuses', { headers }),
          axios.get('/api/teachers', { headers })
        ]);
        if (campusRes.data.success) setCampuses(campusRes.data.campuses || []);
        if (teacherRes.data.success) setTeachers(teacherRes.data.teachers || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMetadata();
  }, []);

  const handleStatusChange = async (id, newStatus, approvedSalary) => {
    try {
      setActionLoading(true);
      const payload = { status: newStatus };
      if (approvedSalary !== undefined) payload.approved_salary = approvedSalary;

      const res = await axios.patch(`/api/staff-applicants/${id}/status`, payload, { headers });
      if (res.data.success) {
        setApplicants((prev) =>
          prev.map((app) => (app._id === id ? res.data.applicant : app))
        );
        showToast(`Status updated to "${newStatus}"`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConvertConfirm = async () => {
    if (!applicantToConvert) return;
    try {
      setActionLoading(true);
      const res = await axios.post(`/api/staff-applicants/${applicantToConvert._id}/convert`, {}, { headers });
      if (res.data.success) {
        setApplicants((prev) =>
          prev.map((app) => (app._id === applicantToConvert._id ? res.data.applicant : app))
        );
        showToast(`Applicant converted to Staff (${res.data.teacher?.employee_code})`);
        setApplicantToConvert(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Conversion to staff failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!applicantToDelete) return;
    try {
      setActionLoading(true);
      await axios.delete(`/api/staff-applicants/${applicantToDelete._id}`, { headers });
      setApplicants((prev) => prev.filter((a) => a._id !== applicantToDelete._id));
      setTotalApplicants((prev) => Math.max(0, prev - 1));
      showToast('Applicant record deleted');
      setApplicantToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete applicant');
    } finally {
      setActionLoading(false);
    }
  };

  const copyApplicationLink = () => {
    const applyUrl = `${window.location.origin}/careers/apply`;
    navigator.clipboard.writeText(applyUrl);
    showToast('Public Application Link copied to clipboard!');
  };

  return {
    applicants, campuses, teachers, selectedCampus, setSelectedCampus, selectedStatus,
    setSelectedStatus, selectedDepartment, setSelectedDepartment, selectedAvailability,
    setSelectedAvailability, searchQuery, setSearchQuery, page, setPage, limit, totalPages,
    totalApplicants, loading, error, setError, toastMessage, viewApplicant, setViewApplicant,
    applicantToDelete, setApplicantToDelete, applicantToConvert, setApplicantToConvert,
    applicantForSalary, setApplicantForSalary, isCustomizeModalOpen, setIsCustomizeModalOpen,
    isMapView, setIsMapView, actionLoading, handleStatusChange, handleConvertConfirm,
    handleDeleteConfirm, copyApplicationLink, refreshApplicants: fetchApplicants
  };
};
