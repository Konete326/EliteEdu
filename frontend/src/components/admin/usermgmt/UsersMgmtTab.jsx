import { useState, useEffect, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getApiBase } from '../../../utils/apiBase';
import UsersTable from './UsersTable';
import UserFormModal from './UserFormModal';
import UserPasswordModal from './UserPasswordModal';
import AssignCampusModal from './AssignCampusModal';
import ConfirmModal from '../../common/ConfirmModal';

const UsersMgmtTab = ({ campuses = [], roles = [], selectedUser, onSelectUser, onTotalChange }) => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [formModalUser, setFormModalUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [passwordUser, setPasswordUser] = useState(null);
  const [campusUser, setCampusUser] = useState(null);
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
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
    } catch {}
  }, [token, page, search, selectedCampus, selectedStatus, onTotalChange]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    await fetch(`${getApiBase()}/user-management/users/${user._id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: nextStatus })
    });
    fetchUsers();
  };

  const handleDeleteUser = async () => {
    if (!deleteTargetUser) return;
    await fetch(`${getApiBase()}/user-management/users/${deleteTargetUser._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setDeleteTargetUser(null);
    if (selectedUser?._id === deleteTargetUser._id && onSelectUser) onSelectUser(null);
    fetchUsers();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-xl">
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
        <button type="button" onClick={() => setShowAddModal(true)} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <UsersTable users={users} selectedUser={selectedUser} onSelectUser={onSelectUser} onEdit={setFormModalUser} onToggleStatus={handleToggleStatus} onResetPassword={setPasswordUser} onAssignCampus={setCampusUser} onDelete={setDeleteTargetUser} />

      <div className="flex items-center justify-between text-xs text-ink-muted px-1">
        <span>Showing {users.length > 0 ? (page - 1) * 20 + 1 : 0}–{Math.min(page * 20, total)} of {total} users</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-line disabled:opacity-40 cursor-pointer">Previous</button>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-line disabled:opacity-40 cursor-pointer">Next</button>
        </div>
      </div>

      {(showAddModal || formModalUser) && (
        <UserFormModal user={formModalUser} roles={roles} campuses={campuses} token={token} onClose={() => { setShowAddModal(false); setFormModalUser(null); }} onSaved={fetchUsers} />
      )}
      {passwordUser && <UserPasswordModal user={passwordUser} token={token} onClose={() => setPasswordUser(null)} onSuccess={fetchUsers} />}
      {campusUser && <AssignCampusModal user={campusUser} campuses={campuses} token={token} onClose={() => setCampusUser(null)} onSaved={fetchUsers} />}
      <ConfirmModal isOpen={Boolean(deleteTargetUser)} onClose={() => setDeleteTargetUser(null)} onConfirm={handleDeleteUser} title="Delete User" message={`Permanently delete user "${deleteTargetUser?.name}" and revoke all their sessions?`} confirmText="Delete User" confirmStyle="danger" />
    </div>
  );
};

export default UsersMgmtTab;
