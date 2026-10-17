import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getApiBase } from '../../utils/apiBase';
import UserMgmtHeader from '../../components/admin/usermgmt/UserMgmtHeader';
import UsersMgmtTab from '../../components/admin/usermgmt/UsersMgmtTab';
import UserRolesTab from '../../components/admin/usermgmt/UserRolesTab';
import SessionMgmtTab from '../../components/admin/usermgmt/SessionMgmtTab';
import UserMgmtSidebar from '../../components/admin/usermgmt/UserMgmtSidebar';
import UserFormModal from '../../components/admin/usermgmt/UserFormModal';
import UserPasswordModal from '../../components/admin/usermgmt/UserPasswordModal';
import AssignCampusModal from '../../components/admin/usermgmt/AssignCampusModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import RoleFormModal from '../../components/admin/usermgmt/RoleFormModal';

const UserManagementPage = ({ defaultTab }) => {
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = () => {
    if (defaultTab) return defaultTab;
    if (location.pathname.includes('roles')) return 'roles';
    if (location.pathname.includes('sessions')) return 'sessions';
    return 'users';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [campuses, setCampuses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showAddRole, setShowAddRole] = useState(false);
  const [formUser, setFormUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [passwordUser, setPasswordUser] = useState(null);
  const [campusUser, setCampusUser] = useState(null);
  const [deleteTargetUser, setDeleteTargetUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    } else if (location.pathname.includes('roles')) {
      setActiveTab('roles');
    } else if (location.pathname.includes('sessions')) {
      setActiveTab('sessions');
    }
  }, [defaultTab, location.pathname]);

  const handleSelectTab = (t) => {
    setActiveTab(t);
    setSelectedUser(null);
    if (t === 'roles' && location.pathname !== '/admin/settings/roles') {
      navigate('/admin/settings/roles', { replace: true });
    } else if (t === 'users' && location.pathname !== '/admin/control-panel/user-management') {
      navigate('/admin/control-panel/user-management', { replace: true });
    }
  };

  const loadData = useCallback(async () => {
    if (!token) return;
    try {
      const h = { Authorization: `Bearer ${token}` };
      const [cRes, rRes] = await Promise.all([
        fetch(`${getApiBase()}/campuses`, { headers: h }).then((r) => r.json()),
        fetch(`${getApiBase()}/user-management/roles`, { headers: h }).then((r) => r.json())
      ]);
      if (cRes.campuses) setCampuses(cRes.campuses);
      if (rRes.roles) setRoles(rRes.roles);
    } catch {}
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleOpenAddUser = () => {
    setFormUser(null);
    setShowUserModal(true);
  };

  const handleOpenEditUser = (u) => {
    setFormUser(u || selectedUser);
    setShowUserModal(true);
  };

  const handleUserSaved = (savedUser) => {
    setShowUserModal(false);
    if (savedUser && selectedUser?._id === savedUser._id) {
      setSelectedUser(savedUser);
    }
    setFormUser(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleToggleStatus = async (user) => {
    const target = user || selectedUser;
    if (!target?._id || !token) return;
    const nextStatus = target.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`${getApiBase()}/user-management/users/${target._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        if (selectedUser?._id === target._id) {
          setSelectedUser((prev) => ({ ...prev, status: nextStatus, is_active: nextStatus === 'Active' }));
        }
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch {}
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetUser?._id || !token) return;
    try {
      await fetch(`${getApiBase()}/user-management/users/${deleteTargetUser._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (selectedUser?._id === deleteTargetUser._id) setSelectedUser(null);
      setDeleteTargetUser(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch {}
  };

  return (
    <div className="w-full space-y-5">
      <UserMgmtHeader activeTab={activeTab} onSelectTab={handleSelectTab} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8 2xl:col-span-9 min-w-0">
          {activeTab === 'users' && (
            <UsersMgmtTab
              campuses={campuses}
              roles={roles}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              onTotalChange={setTotalUsers}
              refreshTrigger={refreshTrigger}
              onAddUser={handleOpenAddUser}
              onEditUser={handleOpenEditUser}
              onResetPassword={(u) => setPasswordUser(u || selectedUser)}
              onAssignCampus={(u) => setCampusUser(u || selectedUser)}
              onToggleStatus={handleToggleStatus}
              onDeleteUser={(u) => setDeleteTargetUser(u || selectedUser)}
              onRefreshData={loadData}
            />
          )}
          {activeTab === 'roles' && (
            <UserRolesTab roles={roles} campuses={campuses} onRefresh={loadData} />
          )}
          {activeTab === 'sessions' && <SessionMgmtTab />}
        </div>

        <div className="xl:col-span-4 2xl:col-span-3 shrink-0">
          <UserMgmtSidebar
            selectedUser={selectedUser}
            onClearSelected={() => setSelectedUser(null)}
            onEditUser={() => handleOpenEditUser(selectedUser)}
            onResetPassword={() => setPasswordUser(selectedUser)}
            onAssignCampus={() => setCampusUser(selectedUser)}
            onToggleStatus={() => handleToggleStatus(selectedUser)}
            onDeleteUser={() => setDeleteTargetUser(selectedUser)}
            roles={roles}
            campuses={campuses}
            totalUsers={totalUsers}
            onAddUser={handleOpenAddUser}
            onAddRole={() => setShowAddRole(true)}
          />
        </div>
      </div>

      {showUserModal && (
        <UserFormModal
          user={formUser}
          roles={roles}
          campuses={campuses}
          token={token}
          onClose={() => { setShowUserModal(false); setFormUser(null); }}
          onSaved={handleUserSaved}
        />
      )}
      {passwordUser && (
        <UserPasswordModal
          user={passwordUser}
          token={token}
          onClose={() => setPasswordUser(null)}
          onSuccess={() => { setPasswordUser(null); setRefreshTrigger((prev) => prev + 1); }}
        />
      )}
      {campusUser && (
        <AssignCampusModal
          user={campusUser}
          campuses={campuses}
          token={token}
          onClose={() => setCampusUser(null)}
          onSaved={(updatedUser) => {
            setCampusUser(null);
            if (selectedUser?._id === updatedUser?._id) setSelectedUser(updatedUser);
            setRefreshTrigger((prev) => prev + 1);
          }}
        />
      )}
      <ConfirmModal
        isOpen={Boolean(deleteTargetUser)}
        onClose={() => setDeleteTargetUser(null)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Permanently delete user "${deleteTargetUser?.name}" and revoke all their sessions?`}
        confirmText="Delete User"
        confirmStyle="danger"
      />
      {showAddRole && (
        <RoleFormModal
          token={token}
          campuses={campuses}
          onClose={() => setShowAddRole(false)}
          onSaved={() => { setShowAddRole(false); loadData(); }}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
