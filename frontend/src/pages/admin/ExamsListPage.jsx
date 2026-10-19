import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import ExamsKpiStrip from '../../components/admin/exams/manager/ExamsKpiStrip';
import TeacherAssignedExamsBanner from '../../components/admin/exams/manager/TeacherAssignedExamsBanner';
import ExamsFilterBar from '../../components/admin/exams/manager/ExamsFilterBar';
import ExamsTable from '../../components/admin/exams/manager/ExamsTable';
import ExamMarksModal from '../../components/admin/exams/sheets/ExamMarksModal';
import ExamPrintModal from '../../components/admin/exams/sheets/ExamPrintModal';
import DeleteExamModal from '../../components/admin/exams/manager/DeleteExamModal';
import usePermissions from '../../hooks/usePermissions';

export default function ExamsListPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const { canDelete, canEdit: canEditPerm, canAdd } = usePermissions();
  const [exams, setExams] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [campuses, setCampuses] = useState([]);
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', term_type: 'All', status: 'All', campus_id: '' });
  const [selectedExamForMarks, setSelectedExamForMarks] = useState(null);
  const [initialPaperForMarks, setInitialPaperForMarks] = useState(null);
  const [selectedExamForPrint, setSelectedExamForPrint] = useState(null);
  const [examToDelete, setExamToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canManage = user?.role === 'Admin' || user?.role === 'SuperAdmin' || Boolean(user?.permissions?.exam_management);

  const fetchExams = async () => {
    try {
      const params = new URLSearchParams(filters);
      const res = await axios.get(`/exams?${params.toString()}`);
      if (res.data?.success) {
        setExams(res.data.exams || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch {
      showNotification('Failed to fetch examinations', 'error');
    }
  };

  useEffect(() => {
    fetchExams();
  }, [filters]);

  useEffect(() => {
    axios.get('/exams/prerequisites').then((res) => {
      if (res.data?.lists?.campuses) setCampuses(res.data.lists.campuses);
    }).catch(() => {});
  }, []);

  const handleDeleteConfirm = async () => {
    if (!examToDelete) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/exams/${examToDelete._id}`);
      showNotification('Exam deleted successfully', 'success');
      setExamToDelete(null);
      fetchExams();
    } catch {
      showNotification('Failed to delete exam', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">Examinations &amp; Assessments</h1>
          <p className="text-xs font-semibold text-ink-muted">Manage terms, datesheets, teacher assignments, and award lists</p>
        </div>
      </div>

      <TeacherAssignedExamsBanner exams={exams} currentUserId={user?._id || user?.id} onOpenMarksModal={(ex, p) => { setSelectedExamForMarks(ex); setInitialPaperForMarks(p); }} />
      <ExamsKpiStrip exams={exams} total={total} />
      <ExamsFilterBar filters={filters} setFilters={setFilters} onReset={() => setFilters({ page: 1, limit: 10, search: '', term_type: 'All', status: 'All', campus_id: '' })} campuses={campuses} canCreate={canManage && canAdd('exams')} />
      <ExamsTable exams={exams} page={filters.page} totalPages={totalPages} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} onOpenMarksModal={(ex) => { setSelectedExamForMarks(ex); setInitialPaperForMarks(null); }} onOpenPrintModal={(ex) => setSelectedExamForPrint(ex)} onDelete={canDelete('exams') ? (ex) => setExamToDelete(ex) : null} canEdit={canManage && canEditPerm('exams')} canDelete={canDelete('exams')} />

      <ExamMarksModal isOpen={Boolean(selectedExamForMarks)} onClose={() => { setSelectedExamForMarks(null); setInitialPaperForMarks(null); }} exam={selectedExamForMarks} initialPaper={initialPaperForMarks} onSaved={fetchExams} />
      <ExamPrintModal isOpen={Boolean(selectedExamForPrint)} onClose={() => setSelectedExamForPrint(null)} exam={selectedExamForPrint} />
      <DeleteExamModal isOpen={Boolean(examToDelete)} onClose={() => setExamToDelete(null)} onConfirm={handleDeleteConfirm} examTitle={examToDelete?.title} isDeleting={isDeleting} />
    </div>
  );
}
