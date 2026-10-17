import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getApiBase } from '../../../utils/apiBase';
import RoleFormModal from './RoleFormModal';
import AssignDashboardModal from './AssignDashboardModal';
import CopyRoleCampusModal from './CopyRoleCampusModal';
import ConfirmModal from '../../common/ConfirmModal';
import UserRoleCard from './UserRoleCard';

const UserRolesTab = ({ roles = [], campuses = [], onRefresh }) => {
  const { token } = useAuth();
  const [localRoles, setLocalRoles] = useState(roles);
  const [search, setSearch] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [editRole, setEditRole] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [dashboardRole, setDashboardRole] = useState(null);
  const [copyRole, setCopyRole] = useState(null);
  const [deleteRole, setDeleteRole] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [liveSync, setLiveSync] = useState(true);

  useEffect(() => {
    setLocalRoles(roles);
  }, [roles]);

  useEffect(() => {
    if (!liveSync || !onRefresh) return;
    const interval = setInterval(() => {
      onRefresh();
    }, 8000);
    return () => clearInterval(interval);
  }, [liveSync, onRefresh]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      if (onRefresh) await onRefresh();
    } finally {
      setTimeout(() => setRefreshing(false), 400);
    }
  };

  const filteredRoles = useMemo(() => {
    return localRoles.filter((r) => {
      const matchSearch = !search.trim() || r.name.toLowerCase().includes(search.toLowerCase());
      const matchCampus = !selectedCampus || r.campus_id?._id === selectedCampus || r.campus_id === selectedCampus;
      return matchSearch && matchCampus;
    });
  }, [localRoles, search, selectedCampus]);

  const handleRoleSaved = (savedRole) => {
    if (savedRole?._id) {
      setLocalRoles((prev) => {
        const exists = prev.some((r) => r._id === savedRole._id);
        if (exists) {
          return prev.map((r) => (r._id === savedRole._id ? { ...r, ...savedRole } : r));
        }
        return [savedRole, ...prev];
      });
    }
    if (onRefresh) onRefresh();
  };

  const handleDashboardSaved = (updatedRole) => {
    if (updatedRole?._id) {
      setLocalRoles((prev) =>
        prev.map((r) => (r._id === updatedRole._id ? { ...r, ...updatedRole } : r))
      );
    }
    if (onRefresh) onRefresh();
  };

  const handleDelete = async () => {
    if (!deleteRole) return;
    const roleId = deleteRole._id;
    setLocalRoles((prev) => prev.filter((r) => r._id !== roleId));
    setDeleteRole(null);
    try {
      await fetch(`${getApiBase()}/user-management/roles/${roleId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } finally {
      if (onRefresh) onRefresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter roles..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
          </div>
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none cursor-pointer"
          >
            <option value="">All Campuses</option>
            {campuses.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setLiveSync(!liveSync)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              liveSync
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-surface dark:bg-surface-dark text-ink-muted border-line'
            }`}
            title={liveSync ? 'Live Sync active (polls every 8s)' : 'Live Sync paused'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${liveSync ? 'bg-emerald-500 animate-pulse' : 'bg-ink-muted'}`} />
            <span>Live Sync</span>
          </button>
          <button
            type="button"
            onClick={handleManualRefresh}
            className="p-2 rounded-xl border border-line dark:border-line-dark hover:bg-surface-secondary text-ink dark:text-ink-dark transition-all cursor-pointer"
            title="Refresh roles from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Role
          </button>
        </div>
      </div>

      {filteredRoles.length === 0 ? (
        <div className="p-8 text-center bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl">
          <Shield className="w-8 h-8 text-ink-muted mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-ink dark:text-ink-dark">No roles found</p>
          <p className="text-xs text-ink-muted mt-0.5">Click "Add Role" to define an institutional role and permissions matrix.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
          {filteredRoles.map((role) => (
            <UserRoleCard
              key={role._id}
              role={role}
              onDashboard={setDashboardRole}
              onCopy={setCopyRole}
              onEdit={setEditRole}
              onDelete={setDeleteRole}
            />
          ))}
        </div>
      )}

      {(isAddOpen || editRole) && (
        <RoleFormModal
          role={editRole}
          campuses={campuses}
          token={token}
          onClose={() => { setIsAddOpen(false); setEditRole(null); }}
          onSaved={handleRoleSaved}
        />
      )}
      {dashboardRole && (
        <AssignDashboardModal
          role={dashboardRole}
          token={token}
          onClose={() => setDashboardRole(null)}
          onSaved={handleDashboardSaved}
        />
      )}
      {copyRole && (
        <CopyRoleCampusModal
          role={copyRole}
          campuses={campuses}
          token={token}
          onClose={() => setCopyRole(null)}
          onCopied={onRefresh}
        />
      )}
      <ConfirmModal
        isOpen={Boolean(deleteRole)}
        onClose={() => setDeleteRole(null)}
        onConfirm={handleDelete}
        title="Delete Role"
        message={`Delete custom role "${deleteRole?.name}"? Linked users will be unlinked.`}
        confirmText="Delete Role"
        confirmStyle="danger"
      />
    </div>
  );
};

export default UserRolesTab;
