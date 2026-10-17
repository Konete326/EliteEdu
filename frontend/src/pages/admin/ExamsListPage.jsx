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

export default function ExamsListPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
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
      const res = await axios.get(`/api/exams?${params.toString()}`);
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
    axios.get('/api/exams/prerequisites').then((res) => {
      if (res.data?.lists?.campuses) setCampuses(res.data.lists.campuses);
    }).catch(() => {});
  }, []);

  const handleDeleteConfirm = async () => {
    if (!examToDelete) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/api/exams/${examToDelete._id}`);
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
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-text-primary dark:text-text-primary-dark">Examinations & Assessments</h1>
        <p className="text-xs text-text-muted dark:text-text-muted-dark">Manage terms, datesheets, teacher assignments, and award lists</p>
      </div>

      <TeacherAssignedExamsBanner exams={exams} currentUserId={user?._id || user?.id} onOpenMarksModal={(ex, p) => { setSelectedExamForMarks(ex); setInitialPaperForMarks(p); }} />
      <ExamsKpiStrip exams={exams} total={total} />
      <ExamsFilterBar filters={filters} setFilters={setFilters} onReset={() => setFilters({ page: 1, limit: 10, search: '', term_type: 'All', status: 'All', campus_id: '' })} campuses={campuses} canCreate={canManage} />
      <ExamsTable exams={exams} page={filters.page} totalPages={totalPages} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} onOpenMarksModal={(ex) => { setSelectedExamForMarks(ex); setInitialPaperForMarks(null); }} onOpenPrintModal={(ex) => setSelectedExamForPrint(ex)} onDelete={(ex) => setExamToDelete(ex)} canEdit={canManage} />

      <ExamMarksModal isOpen={Boolean(selectedExamForMarks)} onClose={() => { setSelectedExamForMarks(null); setInitialPaperForMarks(null); }} exam={selectedExamForMarks} initialPaper={initialPaperForMarks} onSaved={fetchExams} />
      <ExamPrintModal isOpen={Boolean(selectedExamForPrint)} onClose={() => setSelectedExamForPrint(null)} exam={selectedExamForPrint} />
      <DeleteExamModal isOpen={Boolean(examToDelete)} onClose={() => setExamToDelete(null)} onConfirm={handleDeleteConfirm} examTitle={examToDelete?.title} isDeleting={isDeleting} />
    </div>
  );
}
