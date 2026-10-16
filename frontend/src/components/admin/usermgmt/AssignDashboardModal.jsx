import { useState } from 'react';
import { X, LayoutDashboard } from 'lucide-react';
import { getApiBase } from '../../../utils/apiBase';

const DASHBOARDS = [
  { id: 'TeacherDashboard', name: 'Teacher Portal Dashboard', desc: 'Focus on student marks, syllabus, and class attendance' },
  { id: 'AdminDashboard', name: 'Full Admin Dashboard', desc: 'High-level school metrics, enrollment, and operations' },
  { id: 'AcademicDashboard', name: 'Academic Coordinator Dashboard', desc: 'Curriculum oversight, timetables, and teacher progress' },
  { id: 'FinanceDashboard', name: 'Finance & Accounts Dashboard', desc: 'Fee collections, income statements, and expenses' },
  { id: 'ReceptionDashboard', name: 'Reception & CRM Dashboard', desc: 'Inquiries, visitor desk, and new admissions pipeline' }
];

const AssignDashboardModal = ({ role, token, onClose, onSaved }) => {
  const [selected, setSelected] = useState(role?.dashboard_type || 'TeacherDashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${getApiBase()}/user-management/roles/${role._id}/assign-dashboard`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ dashboard_type: selected })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to assign dashboard');
      onSaved(data.role);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Assign Dashboard Template</h3>
              <p className="text-[11px] text-ink-muted">{role?.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-3 text-xs">
          {error && <div className="p-2.5 bg-bad/10 border border-bad/20 rounded-xl text-bad font-medium">{error}</div>}
          <div className="space-y-2">
            {DASHBOARDS.map((d) => (
              <label
                key={d.id}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selected === d.id
                    ? 'border-primary bg-primary/5 text-ink dark:text-ink-dark'
                    : 'border-line dark:border-line-dark hover:bg-surface-secondary/40'
                }`}
              >
                <input
                  type="radio"
                  name="dashboard"
                  value={d.id}
                  checked={selected === d.id}
                  onChange={() => setSelected(d.id)}
                  className="mt-1 text-primary focus:ring-0"
                />
                <div>
                  <div className="font-semibold text-ink dark:text-ink-dark">{d.name}</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">{d.desc}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-line dark:border-line-dark">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-ink cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl bg-primary text-white font-semibold cursor-pointer disabled:opacity-50">
              {loading ? 'Saving...' : 'Apply Layout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignDashboardModal;
