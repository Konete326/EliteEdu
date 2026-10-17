import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import axios from '../../api/axios';
import DatesheetTable from '../../components/admin/examsuite/datesheets/DatesheetTable';
import SeatingPlanModal from '../../components/admin/examsuite/seating/SeatingPlanModal';
import DeleteClassTestModal from '../../components/admin/classtests/DeleteClassTestModal';

const DatesheetsListPage = () => {
  const navigate = useNavigate();
  const [datesheets, setDatesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seatingModalOpen, setSeatingModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchDatesheets = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/exam-suite/datesheets');
      setDatesheets(res.data.datesheets || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatesheets();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/exam-suite/datesheets/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchDatesheets();
    } catch {}
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Datesheets</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Create and manage exam datesheets for each class and exam type.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button onClick={() => setSeatingModalOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Users size={15} /> Generate Seating Arrangement
          </button>
          <button onClick={() => navigate('/admin/exam-management/schedule/new')} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs transition-colors">
            <Plus size={16} /> New Datesheet
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading datesheets...</div>
      ) : (
        <DatesheetTable
          datesheets={datesheets}
          onEdit={(id) => navigate(`/admin/exam-management/schedule/new?edit=${id}`)}
          onDelete={(d) => setDeleteTarget(d)}
        />
      )}

      <SeatingPlanModal isOpen={seatingModalOpen} onClose={() => setSeatingModalOpen(false)} />
      <DeleteClassTestModal isOpen={!!deleteTarget} title="Delete Datesheet" message="Are you sure you want to delete this datesheet?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};

export default DatesheetsListPage;
