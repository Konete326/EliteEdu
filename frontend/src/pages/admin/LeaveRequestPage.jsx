import React, { useState, useEffect, useCallback } from 'react';
import { CalendarCheck, RefreshCw, Printer } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCampus } from '../../context/CampusContext';
import { usePersistentFormDraft } from '../../hooks/usePersistentFormDraft';
import LeaveKpiStrip from '../../components/admin/attendance/leaves/LeaveKpiStrip';
import LeaveRequestFormCard from '../../components/admin/attendance/leaves/LeaveRequestFormCard';
import LeaveRequestsTable from '../../components/admin/attendance/leaves/LeaveRequestsTable';
import LeaveSlipModal from '../../components/admin/attendance/leaves/LeaveSlipModal';
import ConfirmModal from '../../components/common/ConfirmModal';

const INITIAL = { applicant_type: 'Student', student_id: '', grade_id: '', section: 'A', staff_id: '', leave_type: 'Sick Leave', from_date: new Date().toISOString().split('T')[0], to_date: new Date().toISOString().split('T')[0], reason: '', auto_approve: true };

const LeaveRequestPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { activeCampusId } = useCampus();
  const [form, setForm, clearDraft] = usePersistentFormDraft(`leave_req_draft_${user?.school_id || 'default'}`, INITIAL);
  const [data, setData] = useState({ leaves: [], kpis: {}, pagination: {} });
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [applicantFilter, setApplicantFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeSlip, setActiveSlip] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/leaves', { params: { campus_id: activeCampusId, status: statusFilter, applicant_type: applicantFilter, search, page, limit: 15 } });
      setData(res.data);
    } catch {} finally { setLoading(false); }
  }, [activeCampusId, statusFilter, applicantFilter, search, page]);

  const loadPrereqs = async () => {
    try {
      const [gRes, sRes, tRes] = await Promise.all([api.get('/grades'), api.get('/students?limit=250'), api.get('/teachers?limit=200')]);
      setGrades(gRes.data?.grades || gRes.data || []);
      setStudents(sRes.data?.students || sRes.data || []);
      setTeachers(tRes.data?.teachers || tRes.data || []);
    } catch {}
  };

  useEffect(() => { loadPrereqs(); }, []);
  useEffect(() => { loadLeaves(); }, [loadLeaves]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/leaves', { ...form, campus_id: activeCampusId });
      showToast('Leave application submitted successfully!', 'success');
      clearDraft();
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
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div>
          <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Attendance &gt; Leave Request Engine</div>
          <h1 className="text-xl sm:text-2xl font-black text-ink flex items-center gap-2"><CalendarCheck className="text-primary" size={22} /> Leave Applications & Registers</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadLeaves} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-surface text-xs font-bold hover:bg-surface-secondary shadow-2xs cursor-pointer"><RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Reload</button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer"><Printer size={13} /> Print Sheet</button>
        </div>
      </div>

      <LeaveKpiStrip kpis={data.kpis} activeStatus={statusFilter} onSelectStatus={setStatusFilter} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-start">
        <div className="lg:col-span-4 w-full">
          <LeaveRequestFormCard form={form} setForm={setForm} onSubmit={handleSubmit} onReset={clearDraft} isSubmitting={submitting} grades={grades} students={students} teachers={teachers} isAdmin={user?.role === 'Admin' || user?.role === 'SuperAdmin'} />
        </div>
        <div className="lg:col-span-8 w-full">
          <LeaveRequestsTable leaves={data.leaves || []} pagination={data.pagination || {}} search={search} onSearchChange={setSearch} statusFilter={statusFilter} onStatusChange={setStatusFilter} applicantFilter={applicantFilter} onApplicantChange={setApplicantFilter} onApprove={(l) => handleUpdateStatus(l, 'Approved')} onReject={(l) => handleUpdateStatus(l, 'Rejected')} onPrint={setActiveSlip} onDelete={setDeleteTarget} isProcessing={loading} onPageChange={setPage} />
        </div>
      </div>

      <LeaveSlipModal leave={activeSlip} isOpen={Boolean(activeSlip)} onClose={() => setActiveSlip(null)} />
      <ConfirmModal isOpen={Boolean(deleteTarget)} title="Delete Leave Application" message="Are you sure you want to permanently delete this leave application?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};

export default LeaveRequestPage;
