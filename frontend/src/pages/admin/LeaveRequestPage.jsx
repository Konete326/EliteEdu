import React, { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCampus } from '../../context/CampusContext';
import { usePersistentFormDraft } from '../../hooks/usePersistentFormDraft';
import { useLeaveRequestData } from '../../components/admin/attendance/leaves/useLeaveRequestData';
import LeaveHeader from '../../components/admin/attendance/leaves/LeaveHeader';
import LeaveKpiStrip from '../../components/admin/attendance/leaves/LeaveKpiStrip';
import LeaveRequestsTable from '../../components/admin/attendance/leaves/LeaveRequestsTable';
import LeaveApplicationModal from '../../components/admin/attendance/leaves/LeaveApplicationModal';
import LeaveSlipModal from '../../components/admin/attendance/leaves/LeaveSlipModal';
import ConfirmModal from '../../components/common/ConfirmModal';

const INITIAL = {
  applicant_type: 'Student', student_id: '', grade_id: '', section: 'A',
  staff_id: '', leave_type: 'Sick Leave',
  from_date: new Date().toISOString().split('T')[0],
  to_date: new Date().toISOString().split('T')[0],
  reason: '', auto_approve: true
};

const LeaveRequestPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
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
    <div className="w-full space-y-6 pb-12">
      <LeaveHeader
        totalLeaves={data.pagination?.total || data.leaves?.length || 0}
        onNewLeave={() => setIsModalOpen(true)}
        onReload={loadLeaves}
        loading={loading}
      />

      <LeaveKpiStrip kpis={data.kpis} activeStatus={statusFilter} onSelectStatus={setStatusFilter} />

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
        isProcessing={loading}
        onPageChange={setPage}
      />

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
      />

      <LeaveSlipModal leave={activeSlip} isOpen={Boolean(activeSlip)} onClose={() => setActiveSlip(null)} />
      <ConfirmModal isOpen={Boolean(deleteTarget)} title="Delete Leave Application" message="Are you sure you want to permanently delete this leave application?" onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />
    </div>
  );
};

export default LeaveRequestPage;
