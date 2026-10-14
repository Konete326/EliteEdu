import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Trash2 } from 'lucide-react';
import api from '../../services/api';
import ConfirmModal from '../../components/common/ConfirmModal';
import PageLoader from '../../components/common/PageLoader';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get('/teachers');
        setTeachers(res.data.teachers || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load teachers');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleDeleteConfirm = () => {
    console.log('Delete teacher intent:', teacherToDelete?._id);
    setTeacherToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-bg/95 dark:bg-bg-dark/95 backdrop-blur-sm pb-4 pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 -mt-1">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Teachers Directory</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Faculty members registered under your school.</p>
        </div>
        <Link
          to="/admin/teachers/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors shadow-sm w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Teacher</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <PageLoader text="Loading teachers directory..." />
        ) : teachers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 mx-auto text-ink-muted" />
            <p className="text-base font-semibold text-ink dark:text-ink-dark">No teachers registered yet</p>
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Click "Add New Teacher" above to onboard your school's faculty.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-secondary dark:bg-surface-secondary-dark text-xs font-semibold text-ink-sub dark:text-ink-sub-dark uppercase tracking-wider border-b border-line dark:border-line-dark">
                <tr>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Joined Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-line-dark">
                {teachers.map((t) => (
                  <tr key={t._id} className="hover:bg-surface-secondary/50 dark:hover:bg-surface-secondary-dark/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-ink dark:text-ink-dark">{t.name}</td>
                    <td className="px-6 py-4 text-ink-sub dark:text-ink-sub-dark">{t.email}</td>
                    <td className="px-6 py-4 text-ink-muted dark:text-ink-muted-dark font-mono text-xs">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setTeacherToDelete(t)}
                        title="Delete teacher"
                        className="p-1.5 rounded-lg text-ink-muted hover:text-bad hover:bg-bad-soft/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!teacherToDelete}
        onClose={() => setTeacherToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Teacher"
        message={`Are you sure you want to remove ${teacherToDelete?.name || 'this teacher'}? This action cannot be undone.`}
        confirmText="Delete"
        confirmStyle="danger"
      />
    </div>
  );
};

export default TeachersList;
