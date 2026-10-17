import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import axios from '../../api/axios';
import RemarkTable from '../../components/admin/examsuite/remarks/RemarkTable';
import RemarkTemplateModal from '../../components/admin/examsuite/remarks/RemarkTemplateModal';
import DeleteClassTestModal from '../../components/admin/classtests/DeleteClassTestModal';

const ManageRemarksPage = () => {
  const [remarks, setRemarks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRemark, setSelectedRemark] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [showFilterBar, setShowFilterBar] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [remRes, subRes] = await Promise.all([
        axios.get('/api/exam-suite/manage-remarks'),
        axios.get('/api/subjects')
      ]);
      setRemarks(remRes.data.templates || []);
      setSubjects(subRes.data.subjects || subRes.data || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (payload) => {
    try {
      if (selectedRemark) {
        await axios.put(`/api/exam-suite/manage-remarks/${selectedRemark._id}`, payload);
      } else {
        await axios.post('/api/exam-suite/manage-remarks', payload);
      }
      setIsModalOpen(false);
      setSelectedRemark(null);
      fetchData();
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/exam-suite/manage-remarks/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchData();
    } catch {}
  };

  const filtered = remarks.filter(r =>
    r.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.text?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Manage Remarks</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Reusable remark templates for exams. Leave subjects empty to apply to all subjects.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowFilterBar(!showFilterBar)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
              showFilterBar ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Filter size={15} />
            Filter
          </button>
          <button
            onClick={() => { setSelectedRemark(null); setIsModalOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs transition-colors"
          >
            <Plus size={16} />
            Add Remark
          </button>
        </div>
      </div>

      {showFilterBar && (
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search remark templates..."
            className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
          />
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading remark templates...</div>
      ) : (
        <RemarkTable remarks={filtered} onEdit={(r) => { setSelectedRemark(r); setIsModalOpen(true); }} onDelete={(r) => setDeleteTarget(r)} />
      )}

      <RemarkTemplateModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedRemark(null); }} onSave={handleSave} template={selectedRemark} subjects={subjects} />
      <DeleteClassTestModal isOpen={!!deleteTarget} title="Delete Remark Template" message={`Are you sure you want to delete "${deleteTarget?.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};

export default ManageRemarksPage;
