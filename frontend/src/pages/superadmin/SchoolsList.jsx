import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, School, Pencil, Trash2 } from 'lucide-react';
import api from '../../services/api';
import EditSchoolModal from '../../components/superadmin/EditSchoolModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import PageLoader from '../../components/common/PageLoader';

const SchoolsList = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [schoolToEdit, setSchoolToEdit] = useState(null);
  const [schoolToDelete, setSchoolToDelete] = useState(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const res = await api.get('/schools');
      setSchools(res.data.schools || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (school) => {
    try {
      const res = await api.patch(`/schools/${school._id}/status`);
      setSchools(schools.map((s) => (s._id === school._id ? { ...s, is_active: res.data.is_active } : s)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!schoolToDelete) return;
    try {
      await api.delete(`/schools/${schoolToDelete._id}`);
      setSchools(schools.filter((s) => s._id !== schoolToDelete._id));
      setSchoolToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete school');
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 p-4 sm:p-5 rounded-2xl bg-surface/95 dark:bg-[#0c0c0c]/95 backdrop-blur-md border border-line dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink dark:text-ink-dark tracking-tight">Institutions Directory</h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted-dark mt-0.5">Manage schools, hold/pause accounts, edit details, or delete.</p>
        </div>
        <Link to="/superadmin/schools/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-primary/20 w-fit">
          <Plus className="w-4 h-4" />
          <span>Add New School</span>
        </Link>
      </div>
      {error && <div className="p-4 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-sm">{error}</div>}

      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <PageLoader text="Loading institutions directory..." />
        ) : schools.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <School className="w-10 h-10 mx-auto text-ink-muted" />
            <p className="text-base font-semibold text-ink dark:text-ink-dark">No schools registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-secondary dark:bg-surface-secondary-dark text-xs font-semibold text-ink-sub dark:text-ink-sub-dark uppercase tracking-wider border-b border-line dark:border-line-dark">
                <tr>
                  <th className="px-6 py-3.5">Code</th>
                  <th className="px-6 py-3.5">School Name</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Admin Email</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-line-dark">
                {schools.map((s) => (
                  <tr key={s._id} className="hover:bg-surface-secondary/50 dark:hover:bg-surface-secondary-dark/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-ink dark:text-ink-dark">{s.code}</td>
                    <td className="px-6 py-4 font-medium text-ink dark:text-ink-dark">{s.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.school_type === 'Government' ? 'bg-info-soft dark:bg-info/10 text-info dark:text-info-dark' : 'bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark'}`}>{s.school_type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleToggleStatus(s)} title="Click to Toggle Active / On Hold" className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${s.is_active ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.is_active ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {s.is_active ? 'Active' : 'On Hold'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-ink-sub dark:text-ink-sub-dark">{s.admin?.email || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSchoolToEdit(s)} className="p-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors" title="Edit School"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setSchoolToDelete(s)} className="p-1.5 rounded-lg text-ink-muted hover:text-bad hover:bg-bad-soft dark:hover:bg-bad/10 transition-colors" title="Delete School"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <EditSchoolModal isOpen={!!schoolToEdit} school={schoolToEdit} onClose={() => setSchoolToEdit(null)} onUpdated={(updated) => setSchools(schools.map((s) => (s._id === updated._id ? { ...s, ...updated } : s)))} />
      <ConfirmModal isOpen={!!schoolToDelete} onClose={() => setSchoolToDelete(null)} onConfirm={handleDelete} title="Delete School" message={`Are you sure you want to permanently delete "${schoolToDelete?.name}"? All associated data and admin accounts will be removed.`} confirmText="Delete" confirmStyle="danger" />
    </div>
  );
};
export default SchoolsList;
