import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, School } from 'lucide-react';
import api from '../../services/api';

const SchoolsList = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
    fetchSchools();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Institutions Directory</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Manage all onboarded schools and their primary administrators.</p>
        </div>
        <Link
          to="/superadmin/schools/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors shadow-sm w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New School</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-ink-muted dark:text-ink-muted-dark">
            Loading institutions...
          </div>
        ) : schools.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <School className="w-10 h-10 mx-auto text-ink-muted" />
            <p className="text-base font-semibold text-ink dark:text-ink-dark">No schools registered yet</p>
            <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Click "Add New School" above to onboard your first school.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-secondary dark:bg-surface-secondary-dark text-xs font-semibold text-ink-sub dark:text-ink-sub-dark uppercase tracking-wider border-b border-line dark:border-line-dark">
                <tr>
                  <th className="px-6 py-3.5">Code</th>
                  <th className="px-6 py-3.5">School Name</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Board</th>
                  <th className="px-6 py-3.5">Admin Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-line-dark">
                {schools.map((s) => (
                  <tr key={s._id} className="hover:bg-surface-secondary/50 dark:hover:bg-surface-secondary-dark/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-ink dark:text-ink-dark">{s.code}</td>
                    <td className="px-6 py-4 font-medium text-ink dark:text-ink-dark">{s.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          s.school_type === 'Government'
                            ? 'bg-info-soft dark:bg-info/10 text-info dark:text-info-dark'
                            : 'bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark'
                        }`}
                      >
                        {s.school_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ink-muted dark:text-ink-muted-dark">{s.board || '—'}</td>
                    <td className="px-6 py-4 text-ink-sub dark:text-ink-sub-dark">{s.admin?.email || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolsList;
