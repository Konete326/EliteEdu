import { useState, useMemo } from 'react';
import { Search, Plus, Shield, LayoutDashboard, Copy, Trash2, Edit2, Users } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getApiBase } from '../../../utils/apiBase';
import RoleFormModal from './RoleFormModal';
import AssignDashboardModal from './AssignDashboardModal';
import CopyRoleCampusModal from './CopyRoleCampusModal';
import ConfirmModal from '../../common/ConfirmModal';

const UserRolesTab = ({ roles = [], campuses = [], onRefresh }) => {
  const { token } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [editRole, setEditRole] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [dashboardRole, setDashboardRole] = useState(null);
  const [copyRole, setCopyRole] = useState(null);
  const [deleteRole, setDeleteRole] = useState(null);

  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      const matchSearch = !search.trim() || r.name.toLowerCase().includes(search.toLowerCase());
      const matchCampus = !selectedCampus || r.campus_id?._id === selectedCampus || r.campus_id === selectedCampus;
      return matchSearch && matchCampus;
    });
  }, [roles, search, selectedCampus]);

  const handleDelete = async () => {
    if (!deleteRole) return;
    await fetch(`${getApiBase()}/user-management/roles/${deleteRole._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setDeleteRole(null);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter roles..." className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink outline-none focus:border-primary" />
          </div>
          <select value={selectedCampus} onChange={(e) => setSelectedCampus(e.target.value)} className="px-3 py-2 rounded-xl text-xs bg-surface dark:bg-surface-dark border border-line text-ink outline-none cursor-pointer">
            <option value="">All Campuses</option>
            {campuses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <button type="button" onClick={() => setIsAddOpen(true)} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer">
          <Plus className="w-4 h-4" /> Add Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
        {filteredRoles.map((r) => {
          const activeModules = (r.permissions || []).filter((p) => p.view || p.add || p.edit || p.delete || p.filter || p.reports).length;
          return (
            <div key={r._id} className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-ink dark:text-ink-dark">{r.name}</h4>
                      <span className="text-[10px] text-ink-muted">{r.campus_id?.name || 'Global / All Campuses'}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                    {r.dashboard_type?.replace('Dashboard', '') || 'Teacher'} UI
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-2 line-clamp-2">{r.description || 'Dynamic tenant role with granular module permissions.'}</p>
                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-line dark:border-line-dark text-[11px] text-ink-muted">
                  <span><strong>{activeModules}</strong> Modules</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {r.user_count || 0} Users</span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-line dark:border-line-dark">
                <button type="button" onClick={() => setDashboardRole(r)} title="Change Dashboard Layout" className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-muted hover:text-primary cursor-pointer"><LayoutDashboard className="w-4 h-4" /></button>
                <button type="button" onClick={() => setCopyRole(r)} title="Copy to Campus" className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-muted hover:text-primary cursor-pointer"><Copy className="w-4 h-4" /></button>
                <button type="button" onClick={() => setEditRole(r)} title="Edit Permissions" className="p-1.5 rounded-lg hover:bg-surface-secondary text-ink-muted hover:text-primary cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                {!r.is_system && (
                  <button type="button" onClick={() => setDeleteRole(r)} title="Delete Role" className="p-1.5 rounded-lg hover:bg-bad/10 text-ink-muted hover:text-bad cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {(isAddOpen || editRole) && <RoleFormModal role={editRole} campuses={campuses} token={token} onClose={() => { setIsAddOpen(false); setEditRole(null); }} onSaved={onRefresh} />}
      {dashboardRole && <AssignDashboardModal role={dashboardRole} token={token} onClose={() => setDashboardRole(null)} onSaved={onRefresh} />}
      {copyRole && <CopyRoleCampusModal role={copyRole} campuses={campuses} token={token} onClose={() => setCopyRole(null)} onCopied={onRefresh} />}
      <ConfirmModal isOpen={Boolean(deleteRole)} onClose={() => setDeleteRole(null)} onConfirm={handleDelete} title="Delete Role" message={`Delete custom role "${deleteRole?.name}"? Linked users will be unlinked.`} confirmText="Delete Role" confirmStyle="danger" />
    </div>
  );
};

export default UserRolesTab;
