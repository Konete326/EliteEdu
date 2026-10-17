import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from '../../api/axios';
import MarkSheetTabsHeader from '../../components/admin/examsuite/marksheet/MarkSheetTabsHeader';
import MarkSheetBrowseTab from '../../components/admin/examsuite/marksheet/MarkSheetBrowseTab';
import MarkSheetAttendanceTab from '../../components/admin/examsuite/marksheet/MarkSheetAttendanceTab';
import MarkSheetGazetteTab from '../../components/admin/examsuite/marksheet/MarkSheetGazetteTab';
import MarkSheetLockTab from '../../components/admin/examsuite/marksheet/MarkSheetLockTab';
import MarkSheetSettingsTab from '../../components/admin/examsuite/marksheet/MarkSheetSettingsTab';
import NewMarkSheetModal from '../../components/admin/examsuite/marksheet/NewMarkSheetModal';
import EnterMarksModal from '../../components/admin/examsuite/marksheet/EnterMarksModal';
import DeleteClassTestModal from '../../components/admin/classtests/DeleteClassTestModal';

const MarkSheetsPage = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [markSheets, setMarkSheets] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [questionPapers, setQuestionPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [enterMarksSheetId, setEnterMarksSheetId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [msRes, gRes, sRes, cRes, qpRes] = await Promise.all([
        axios.get('/api/exam-suite/mark-sheets'),
        axios.get('/api/grades'),
        axios.get('/api/subjects'),
        axios.get('/api/exam-suite/categories'),
        axios.get('/api/question-papers/papers')
      ]);
      setMarkSheets(msRes.data.markSheets || []);
      setGrades(gRes.data.grades || gRes.data || []);
      setSubjects(sRes.data.subjects || sRes.data || []);
      setCategories(cRes.data.categories || []);
      setQuestionPapers(qpRes.data.papers || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateSheet = async (payload) => {
    try {
      await axios.post('/api/exam-suite/mark-sheets', payload);
      setIsNewModalOpen(false);
      fetchData();
    } catch {}
  };

  const handleToggleLock = async (id) => {
    try {
      await axios.put(`/api/exam-suite/mark-sheets/${id}/lock`);
      fetchData();
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/exam-suite/mark-sheets/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchData();
    } catch {}
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Mark Sheets</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Manage exam mark sheets, class results, and upload progress.</p>
        </div>
        <button onClick={() => setIsNewModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs self-start sm:self-auto">
          <Plus size={16} /> New Mark Sheet
        </button>
      </div>

      <MarkSheetTabsHeader activeTab={activeTab} onSelectTab={setActiveTab} />

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading mark sheets...</div>
      ) : activeTab === 'browse' ? (
        <MarkSheetBrowseTab markSheets={markSheets} onEnterMarks={(id) => setEnterMarksSheetId(id)} onToggleLock={handleToggleLock} onDelete={(ms) => setDeleteTarget(ms)} />
      ) : activeTab === 'attendance' ? (
        <MarkSheetAttendanceTab />
      ) : activeTab === 'results' ? (
        <MarkSheetGazetteTab grades={grades} />
      ) : activeTab === 'lock' ? (
        <MarkSheetLockTab markSheets={markSheets} onToggleLock={handleToggleLock} />
      ) : (
        <MarkSheetSettingsTab />
      )}

      <NewMarkSheetModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} onSave={handleCreateSheet} grades={grades} subjects={subjects} categories={categories} questionPapers={questionPapers} />
      <EnterMarksModal isOpen={!!enterMarksSheetId} sheetId={enterMarksSheetId} onClose={() => setEnterMarksSheetId(null)} onMarksSaved={fetchData} />
      <DeleteClassTestModal isOpen={!!deleteTarget} title="Delete Mark Sheet" message="Are you sure you want to remove this mark sheet?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};

export default MarkSheetsPage;
