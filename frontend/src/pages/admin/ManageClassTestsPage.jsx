import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { usePersistentFormDraft } from '../../hooks/usePersistentFormDraft';
import axios from '../../utils/axiosConfig';
import ClassTestHeaderBar from '../../components/admin/classtests/ClassTestHeaderBar';
import ClassTestFormCard from '../../components/admin/classtests/ClassTestFormCard';
import ClassTestListAndSheet from '../../components/admin/classtests/ClassTestListAndSheet';
import ClassTestAwardSheetPrintModal from '../../components/admin/classtests/ClassTestAwardSheetPrintModal';
import DeleteClassTestModal from '../../components/admin/classtests/DeleteClassTestModal';

const INITIAL = { title: '', test_date: new Date().toISOString().substring(0, 10), grade_id: '', section: 'A', subject_id: '', teacher_id: '', total_marks: 25, passing_marks: 8, topic: '' };

export default function ManageClassTestsPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [formData, setFormData, clearDraft] = usePersistentFormDraft(`class_test_draft_${user?.school_id || 'default'}`, INITIAL);
  const [editingTest, setEditingTest] = useState(null);
  const [testState, setTestState] = useState({ tests: [], total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ page: 1, limit: 15, grade_id: '', section: 'All', subject_id: '', status: 'All', search: '' });
  const [prereqs, setPrereqs] = useState({ campuses: [], grades: [], subjects: [], teachers: [] });
  const [activeView, setActiveView] = useState('list');
  const [activeTest, setActiveTest] = useState(null);
  const [sheetRows, setSheetRows] = useState([]);
  const [loadingState, setLoadingState] = useState({ isPrereq: false, isSavingForm: false, isSavingMarks: false, isDeleting: false });
  const [modals, setModals] = useState({ testToDelete: null, testToPrint: null });

  const fetchPrereqs = () => {
    setLoadingState((p) => ({ ...p, isPrereq: true }));
    axios.get('/api/class-tests/prerequisites').then((res) => setPrereqs(res.data)).finally(() => setLoadingState((p) => ({ ...p, isPrereq: false })));
  };

  const fetchTests = () => {
    const params = new URLSearchParams(filters);
    axios.get(`/api/class-tests?${params.toString()}`).then((res) => {
      setTestState({ tests: res.data.tests || [], total: res.data.total || 0, totalPages: res.data.totalPages || 1 });
    });
  };

  useEffect(() => { fetchPrereqs(); }, []);
  useEffect(() => { fetchTests(); }, [filters]);

  const handleSaveForm = async (e) => {
    e.preventDefault();
    try {
      setLoadingState((p) => ({ ...p, isSavingForm: true }));
      if (editingTest) await axios.put(`/api/class-tests/${editingTest._id}`, formData);
      else await axios.post('/api/class-tests', formData);
      showNotification(editingTest ? 'Test updated!' : 'Test scheduled!', 'success');
      setEditingTest(null);
      clearDraft();
      setFormData(INITIAL);
      fetchTests();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setLoadingState((p) => ({ ...p, isSavingForm: false }));
    }
  };

  const handleSelectTest = (test) => {
    setActiveTest(test);
    axios.get(`/api/class-tests/${test._id}/sheet`).then((res) => {
      setSheetRows(res.data.rows || []);
      setActiveView('sheet');
    }).catch(() => showNotification('Failed to load sheet', 'error'));
  };

  const handleSaveMarks = async () => {
    if (!activeTest) return;
    try {
      setLoadingState((p) => ({ ...p, isSavingMarks: true }));
      await axios.post(`/api/class-tests/${activeTest._id}/marks`, { marks: sheetRows });
      showNotification('Marks published!', 'success');
      fetchTests();
    } catch {
      showNotification('Failed to save marks', 'error');
    } finally {
      setLoadingState((p) => ({ ...p, isSavingMarks: false }));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modals.testToDelete) return;
    try {
      setLoadingState((p) => ({ ...p, isDeleting: true }));
      await axios.delete(`/api/class-tests/${modals.testToDelete._id}`);
      showNotification('Test deleted', 'success');
      if (activeTest?._id === modals.testToDelete._id) { setActiveTest(null); setActiveView('list'); }
      setModals((p) => ({ ...p, testToDelete: null }));
      fetchTests();
    } catch {
      showNotification('Delete failed', 'error');
    } finally {
      setLoadingState((p) => ({ ...p, isDeleting: false }));
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      <ClassTestHeaderBar />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-4">
          <ClassTestFormCard formData={formData} setFormData={setFormData} onSave={handleSaveForm} onReset={() => { clearDraft(); setFormData(INITIAL); setEditingTest(null); }} isSaving={loadingState.isSavingForm} editingTest={editingTest} onCancelEdit={() => { setEditingTest(null); setFormData(INITIAL); }} prereqs={prereqs} onRefreshPrereqs={fetchPrereqs} isPrereqLoading={loadingState.isPrereq} />
        </div>
        <div className="lg:col-span-8">
          <ClassTestListAndSheet tests={testState.tests} page={filters.page} total={testState.total} totalPages={testState.totalPages} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} filters={filters} setFilters={setFilters} onResetFilters={() => setFilters({ page: 1, limit: 15, grade_id: '', section: 'All', subject_id: '', status: 'All', search: '' })} prereqs={prereqs} activeView={activeView} setActiveView={setActiveView} activeTest={activeTest} onSelectTest={handleSelectTest} onEditTest={(t) => { setEditingTest(t); setFormData(t); }} onDeleteTest={(t) => setModals((m) => ({ ...m, testToDelete: t }))} onPrintTest={(t) => { setModals((m) => ({ ...m, testToPrint: t })); handleSelectTest(t); }} sheetRows={sheetRows} setSheetRows={setSheetRows} onSaveMarks={handleSaveMarks} isSavingMarks={loadingState.isSavingMarks} onBackToList={() => setActiveView('list')} />
        </div>
      </div>
      <ClassTestAwardSheetPrintModal isOpen={Boolean(modals.testToPrint)} onClose={() => setModals((m) => ({ ...m, testToPrint: null }))} test={modals.testToPrint} rows={sheetRows} />
      <DeleteClassTestModal isOpen={Boolean(modals.testToDelete)} onClose={() => setModals((m) => ({ ...m, testToDelete: null }))} onConfirm={handleDeleteConfirm} testTitle={modals.testToDelete?.title} isDeleting={loadingState.isDeleting} />
    </div>
  );
}
