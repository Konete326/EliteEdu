import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getApiBase } from '../../../utils/apiBase';
import UsersTable from './UsersTable';
import UserFormModal from './UserFormModal';
import UserPasswordModal from './UserPasswordModal';
import AssignCampusModal from './AssignCampusModal';
import ConfirmModal from '../../common/ConfirmModal';

const UsersMgmtTab = ({
  campuses = [],
  roles = [],
  selectedUser,
  onSelectUser,
  onTotalChange,
  refreshTrigger = 0,
  onAddUser,
  onEditUser,
  onResetPassword,
  onAssignCampus,
  onToggleStatus,
  onDeleteUser,
  onRefreshData
}) => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLiveSync, setIsLiveSync] = useState(true);
  const [loading, setLoading] = useState(false);
  const [localFormUser, setLocalFormUser] = useState(null);
  const [showLocalAddModal, setShowLocalAddModal] = useState(false);
  const [localPasswordUser, setLocalPasswordUser] = useState(null);
  const [localCampusUser, setLocalCampusUser] = useState(null);
  const [localDeleteUser, setLocalDeleteUser] = useState(null);

  const fetchUsers = useCallback(async (isSilent = false) => {
    if (!token) return;
    if (!isSilent) setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: '20', search, campus_id: selectedCampus, status: selectedStatus });
      const res = await fetch(`${getApiBase()}/user-management/users?${q.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        if (onTotalChange) onTotalChange(data.total || 0);
      }
    } catch {} finally {
      if (!isSilent) setLoading(false);
    }
  }, [token, page, search, selectedCampus, selectedStatus, onTotalChange]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshTrigger]);

  useEffect(() => {
    if (!isLiveSync) return;
    const interval = setInterval(() => {
      fetchUsers(true);
    }, 8000);
    return () => clearInterval(interval);
  }, [isLiveSync, fetchUsers]);

  const handleManualSync = () => {
    fetchUsers(false);
    if (onRefreshData) onRefreshData();
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    setUsers((prev) =>
      prev.map((u) => (u._id === user._id ? { ...u, status: nextStatus, is_active: nextStatus === 'Active' } : u))
    );
    if (onToggleStatus) {
      onToggleStatus(user);
    } else {
      await fetch(`${getApiBase()}/user-management/users/${user._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: nextStatus })
      });
      fetchUsers(true);
    }
  };

  const handleDeleteUser = async () => {
    if (!localDeleteUser) return;
    setUsers((prev) => prev.filter((u) => u._id !== localDeleteUser._id));
    setTotal((prev) => Math.max(0, prev - 1));
    await fetch(`${getApiBase()}/user-management/users/${localDeleteUser._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setLocalDeleteUser(null);
    if (selectedUser?._id === localDeleteUser._id && onSelectUser) onSelectUser(null);
    fetchUsers(true);
  };

  const handleAdd = onAddUser || (() => setShowLocalAddModal(true));
  const handleEdit = onEditUser || setLocalFormUser;
  const handleReset = onResetPassword || setLocalPasswordUser;
  const handleCampus = onAssignCampus || setLocalCampusUser;
  const handleDelete = onDeleteUser || setLocalDeleteUser;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search users..." className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary" />
          </div>
          <select value={selectedCampus} onChange={(e) => { setSelectedCampus(e.target.value); setPage(1); }} className="px-3 py-2 rounded-xl text-xs bg-surface dark:bg-surface-dark border border-line text-ink outline-none cursor-pointer">
            <option value="">All Campuses</option>
            {campuses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }} className="px-3 py-2 rounded-xl text-xs bg-surface dark:bg-surface-dark border border-line text-ink outline-none cursor-pointer">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLiveSync(!isLiveSync)}
            className={`px-2.5 py-2 rounded-xl text-[11px] font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isLiveSync
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                : 'bg-surface-secondary text-ink-muted border-line'
            }`}
            title={isLiveSync ? 'Live sync active (polling every 8s)' : 'Live sync paused'}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveSync ? 'bg-emerald-500 animate-pulse' : 'bg-ink-muted/40'}`} />
            <span>{isLiveSync ? 'Live' : 'Paused'}</span>
          </button>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={loading}
            className="px-3 py-2 rounded-xl text-xs font-semibold border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark hover:border-primary flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            title="Sync live user data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-primary' : 'text-ink-muted'}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
          <button type="button" onClick={handleAdd} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer">
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      <UsersTable users={users} selectedUser={selectedUser} onSelectUser={onSelectUser} onEdit={handleEdit} onToggleStatus={handleToggleStatus} onResetPassword={handleReset} onAssignCampus={handleCampus} onDelete={handleDelete} />

      <div className="flex items-center justify-between text-xs text-ink-muted px-1">
        <span>Showing {users.length > 0 ? (page - 1) * 20 + 1 : 0}–{Math.min(page * 20, total)} of {total} users</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-line disabled:opacity-40 cursor-pointer">Previous</button>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-line disabled:opacity-40 cursor-pointer">Next</button>
        </div>
      </div>

      {!onAddUser && (showLocalAddModal || localFormUser) && (
        <UserFormModal user={localFormUser} roles={roles} campuses={campuses} token={token} onClose={() => { setShowLocalAddModal(false); setLocalFormUser(null); }} onSaved={fetchUsers} />
      )}
      {!onResetPassword && localPasswordUser && (
        <UserPasswordModal user={localPasswordUser} token={token} onClose={() => setLocalPasswordUser(null)} onSuccess={fetchUsers} />
      )}
      {!onAssignCampus && localCampusUser && (
        <AssignCampusModal user={localCampusUser} campuses={campuses} token={token} onClose={() => setLocalCampusUser(null)} onSaved={fetchUsers} />
      )}
      {!onDeleteUser && (
        <ConfirmModal isOpen={Boolean(localDeleteUser)} onClose={() => setLocalDeleteUser(null)} onConfirm={handleDeleteUser} title="Delete User" message={`Permanently delete user "${localDeleteUser?.name}" and revoke all their sessions?`} confirmText="Delete User" confirmStyle="danger" />
      )}
    </div>
  );
};

export default UsersMgmtTab;
