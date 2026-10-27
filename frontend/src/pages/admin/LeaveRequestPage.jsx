import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCampus } from '../../context/CampusContext';
import { usePersistentFormDraft } from '../../hooks/usePersistentFormDraft';
import { useLeaveRequestData } from '../../components/admin/attendance/leaves/useLeaveRequestData';
import LeaveHeader from '../../components/admin/attendance/leaves/LeaveHeader';
import LeaveKpiStrip from '../../components/admin/attendance/leaves/LeaveKpiStrip';
import LeaveRequestsTable from '../../components/admin/attendance/leaves/LeaveRequestsTable';
import LeaveApplicationModal from '../../components/admin/attendance/leaves/LeaveApplicationModal';
import LeaveSlipModal from '../../components/admin/attendance/leaves/LeaveSlipModal';
import LeaveRequestsPrintSheet from '../../components/admin/attendance/leaves/LeaveRequestsPrintSheet';
import ConfirmModal from '../../components/common/ConfirmModal';
import { emitToastSuccess, emitToastError, emitToastInfo, emitToastWarning } from '../../utils/toastEvents';

const INITIAL = {
  applicant_type: 'Student', student_id: '', grade_id: '', section: 'A',
  staff_id: '', leave_type: 'Sick Leave',
  from_date: new Date().toISOString().split('T')[0],
  to_date: new Date().toISOString().split('T')[0],
  reason: '', auto_approve: true
};

const LeaveRequestPage = () => {
  const { user } = useAuth();
  const showToast = (message, type = 'info') => {
    if (type === 'success') emitToastSuccess(message);
    else if (type === 'error') emitToastError(message);
    else if (type === 'warning') emitToastWarning(message);
    else emitToastInfo(message);
  };
  const { activeCampusId } = useCampus();
  const [form, setForm, clearDraft] = usePersistentFormDraft(`leave_req_draft_${user?.school_id || 'default'}`, INITIAL);
  const [statusFilter, setStatusFilter] = useState('all');
  const [applicantFilter, setApplicantFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlip, setActiveSlip] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, grades, students, teachers, loading, loadLeaves } = useLeaveRequestData(
    activeCampusId, statusFilter, applicantFilter, search, page
  );

  useEffect(() => {
    const handleLeaveSync = () => {
      loadLeaves();
    };
    window.addEventListener('eliteedu:leave-updated', handleLeaveSync);
    return () => window.removeEventListener('eliteedu:leave-updated', handleLeaveSync);
  }, [loadLeaves]);

  const handleReload = async () => {
    await loadLeaves();
    showToast('Leave applications refreshed', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/leaves', { ...form, campus_id: activeCampusId });
      showToast('Leave application submitted successfully!', 'success');
      clearDraft();
      setIsModalOpen(false);
      loadLeaves();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit application', 'error');
    } finally { setSubmitting(false); }
  };

  const handleUpdateStatus = async (leave, status) => {
    try {
      await api.patch(`/leaves/${leave._id}/status`, { status });
      showToast(status === 'Approved' ? 'Leave Approved & Synced to Attendance Register!' : 'Leave request rejected', status === 'Approved' ? 'success' : 'info');
      loadLeaves();
    } catch (err) { showToast(err.response?.data?.message || 'Status update failed', 'error'); }
  };

  const handleWhatsApp = (leave) => {
    const isStudent = leave.applicant_type === 'Student';
    const name = isStudent ? leave.student_id?.name : leave.staff_id?.name;
    const rawPhone = isStudent
      ? (leave.student_id?.contact_number || leave.student_id?.emergency_contact_no || '')
      : (leave.staff_id?.phone || leave.staff_id?.contact_number || '');
    const cleanPhone = String(rawPhone).replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      showToast(`No contact number registered for ${name || 'applicant'}`, 'warning');
      return;
    }
    let formattedPhone = cleanPhone;
    if (formattedPhone.startsWith('0')) formattedPhone = '92' + formattedPhone.slice(1);
    const applicantName = name || 'Applicant';
    const text = `Assalam-o-Alaikum ${applicantName},\n\nRegarding your Leave Application (${leave.leave_type}) from ${leave.from_date} to ${leave.to_date} (${leave.total_days} Day(s)):\nCurrent Status: ${leave.status.toUpperCase()}\nReason: ${leave.reason}\n\nElite Educational Institution`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/leaves/${deleteTarget._id}`);
      showToast('Leave application deleted', 'success');
      setDeleteTarget(null);
      loadLeaves();
    } catch (err) { showToast(err.response?.data?.message || 'Delete failed', 'error'); }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col min-h-0 gap-3 print:hidden">
        <div className="shrink-0 space-y-3">
          <LeaveHeader
            onNewLeave={() => setIsModalOpen(true)}
            onReload={handleReload}
            loading={loading}
          />
          <LeaveKpiStrip kpis={data.kpis} activeStatus={statusFilter} onSelectStatus={setStatusFilter} />
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <LeaveRequestsTable
            leaves={data.leaves || []}
            pagination={data.pagination || {}}
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            applicantFilter={applicantFilter}
            onApplicantChange={setApplicantFilter}
            onApprove={(l) => handleUpdateStatus(l, 'Approved')}
            onReject={(l) => handleUpdateStatus(l, 'Rejected')}
            onPrint={setActiveSlip}
            onDelete={setDeleteTarget}
            onWhatsApp={handleWhatsApp}
            isProcessing={loading}
            onPageChange={setPage}
            canApprove={user?.role === 'Admin' || user?.role === 'SuperAdmin'}
          />
        </div>

        <LeaveApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onReset={clearDraft}
          isSubmitting={submitting}
          grades={grades}
          students={students}
          teachers={teachers}
          isAdmin={user?.role === 'Admin' || user?.role === 'SuperAdmin'}
          isTeacher={user?.role === 'Teacher'}
          currentUser={user}
        />

        <LeaveSlipModal leave={activeSlip} isOpen={Boolean(activeSlip)} onClose={() => setActiveSlip(null)} />
        <ConfirmModal isOpen={Boolean(deleteTarget)} title="Delete Leave Application" message="Are you sure you want to permanently delete this leave application?" onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />
      </div>

      <LeaveRequestsPrintSheet
        leaves={data.leaves || []}
        kpis={data.kpis || {}}
        statusFilter={statusFilter}
        applicantFilter={applicantFilter}
      />
    </>
  );
};

export default LeaveRequestPage;
