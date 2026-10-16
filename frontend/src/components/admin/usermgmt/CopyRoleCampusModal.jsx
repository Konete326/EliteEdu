import { useState } from 'react';
import { X, Copy, Building } from 'lucide-react';
import { getApiBase } from '../../../utils/apiBase';

const CopyRoleCampusModal = ({ role, campuses = [], token, onClose, onCopied }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleCampus = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleCopy = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return setError('Select at least one destination campus');
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${getApiBase()}/user-management/roles/${role._id}/copy-to-campus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ target_campus_ids: selectedIds })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Copy failed');
      onCopied();
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
            <Copy className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Copy Role to Campuses</h3>
              <p className="text-[11px] text-ink-muted">Clone "{role?.name}" with all permissions</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleCopy} className="p-6 space-y-4 text-xs">
          {error && <div className="p-2.5 bg-bad/10 border border-bad/20 rounded-xl text-bad font-medium">{error}</div>}
          <div>
            <label className="block font-semibold text-ink dark:text-ink-dark mb-2">Select Target Campuses</label>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {campuses.map((c) => (
                <label key={c._id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-secondary/30 hover:bg-surface-secondary/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c._id)}
                    onChange={() => toggleCampus(c._id)}
                    className="rounded text-primary focus:ring-0"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-ink dark:text-ink-dark">{c.name}</div>
                    <div className="text-[10px] text-ink-muted">{c.code || 'Campus'} · {c.city || 'Main'}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-line dark:border-line-dark">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-ink cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl bg-primary text-white font-semibold cursor-pointer disabled:opacity-50">
              {loading ? 'Cloning...' : `Copy to (${selectedIds.length}) Campuses`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CopyRoleCampusModal;
