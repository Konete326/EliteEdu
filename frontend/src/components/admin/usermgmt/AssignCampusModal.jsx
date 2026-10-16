import { useState } from 'react';
import { X, Building } from 'lucide-react';
import { getApiBase } from '../../../utils/apiBase';

const AssignCampusModal = ({ user, campuses = [], token, onClose, onSaved }) => {
  const [primaryCampus, setPrimaryCampus] = useState(user?.campus_id?._id || user?.campus_id || '');
  const [selectedCampuses, setSelectedCampuses] = useState(
    (user?.assigned_campuses || []).map((c) => c._id || c)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleCampus = (cid) => {
    setSelectedCampuses((prev) =>
      prev.includes(cid) ? prev.filter((id) => id !== cid) : [...prev, cid]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${getApiBase()}/user-management/users/${user._id}/assign-campus`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ campus_id: primaryCampus || null, assigned_campuses: selectedCampuses })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to assign campuses');
      onSaved(data.user);
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
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Assign Campuses</h3>
              <p className="text-[11px] text-ink-muted">{user?.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          {error && <div className="p-2.5 bg-bad/10 border border-bad/20 rounded-xl text-bad text-xs font-medium">{error}</div>}
          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Primary Campus</label>
            <select
              value={primaryCampus}
              onChange={(e) => setPrimaryCampus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
            >
              <option value="">None / Unassigned</option>
              {campuses.map((c) => <option key={c._id} value={c._id}>{c.name} ({c.code || 'Main'})</option>)}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-2">Permitted Multi-Campuses</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {campuses.map((c) => (
                <label key={c._id} className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-secondary/30 hover:bg-surface-secondary/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCampuses.includes(c._id)}
                    onChange={() => toggleCampus(c._id)}
                    className="rounded text-primary focus:ring-0"
                  />
                  <span className="font-medium text-ink dark:text-ink-dark">{c.name}</span>
                  <span className="text-[10px] text-ink-muted ml-auto">{c.code || c.city || 'Campus'}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-line dark:border-line-dark">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-ink cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl bg-primary text-white font-semibold cursor-pointer disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Campuses'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignCampusModal;
