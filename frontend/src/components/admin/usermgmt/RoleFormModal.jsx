import { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { getApiBase } from '../../../utils/apiBase';
import { getInitialPermissions } from '../../../utils/defaultModulesList';
import RolePermissionsTable from './RolePermissionsTable';

const RoleFormModal = ({ role, campuses = [], token, onClose, onSaved }) => {
  const isEdit = Boolean(role?._id);
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [dashboardType, setDashboardType] = useState(role?.dashboard_type || 'TeacherDashboard');
  const [campusId, setCampusId] = useState(role?.campus_id?._id || role?.campus_id || '');
  const [permissions, setPermissions] = useState(() => getInitialPermissions(role?.permissions));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleAction = (idx, action) => {
    setPermissions((prev) => prev.map((p, i) => (i === idx ? { ...p, [action]: !p[action] } : p)));
  };

  const toggleAllForModule = (idx) => {
    setPermissions((prev) => prev.map((p, i) => {
      if (i !== idx) return p;
      const next = !(p.view && p.add && p.edit && p.delete && p.filter && p.reports);
      return { ...p, view: next, add: next, edit: next, delete: next, filter: next, reports: next };
    }));
  };

  const toggleGlobalAll = () => {
    const hasAnyOff = permissions.some((p) => !p.view || !p.add || !p.edit || !p.delete || !p.filter || !p.reports);
    setPermissions((prev) => prev.map((p) => ({ ...p, view: hasAnyOff, add: hasAnyOff, edit: hasAnyOff, delete: hasAnyOff, filter: hasAnyOff, reports: hasAnyOff })));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Role name is required');
    setSaving(true);
    setError('');

    try {
      const url = isEdit ? `${getApiBase()}/user-management/roles/${role._id}` : `${getApiBase()}/user-management/roles`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, description, dashboard_type: dashboardType, campus_id: campusId || null, permissions })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Saving failed');
      onSaved(data.role);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl w-full max-w-3xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-ink dark:text-ink-dark">{isEdit ? 'Edit Role & Permissions' : 'Create Custom Role'}</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {error && <div className="p-2.5 bg-bad/10 border border-bad/20 rounded-xl text-bad font-medium">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Role Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Senior Teacher" className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line text-ink outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Dashboard Template</label>
              <select value={dashboardType} onChange={(e) => setDashboardType(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line text-ink outline-none focus:border-primary">
                <option value="TeacherDashboard">Teacher Portal Dashboard</option>
                <option value="AdminDashboard">Full Admin Dashboard</option>
                <option value="AcademicDashboard">Academic Coordinator Dashboard</option>
                <option value="FinanceDashboard">Finance & Accounts Dashboard</option>
                <option value="ReceptionDashboard">Reception & CRM Dashboard</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Campus Scope</label>
              <select value={campusId} onChange={(e) => setCampusId(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line text-ink outline-none focus:border-primary">
                <option value="">Global / All Campuses</option>
                {campuses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <RolePermissionsTable permissions={permissions} toggleAction={toggleAction} toggleAllForModule={toggleAllForModule} toggleGlobalAll={toggleGlobalAll} />
          <div className="flex justify-end gap-2 pt-3 border-t border-line dark:border-line-dark">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-ink cursor-pointer">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-primary text-white font-semibold cursor-pointer disabled:opacity-50">{saving ? 'Saving...' : isEdit ? 'Update Role' : 'Create Role'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleFormModal;
