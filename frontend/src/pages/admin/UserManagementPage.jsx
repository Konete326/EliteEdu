import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getApiBase } from '../../utils/apiBase';
import UserMgmtHeader from '../../components/admin/usermgmt/UserMgmtHeader';
import UsersMgmtTab from '../../components/admin/usermgmt/UsersMgmtTab';
import UserRolesTab from '../../components/admin/usermgmt/UserRolesTab';
import SessionMgmtTab from '../../components/admin/usermgmt/SessionMgmtTab';
import UserMgmtSidebar from '../../components/admin/usermgmt/UserMgmtSidebar';
import UserFormModal from '../../components/admin/usermgmt/UserFormModal';
import RoleFormModal from '../../components/admin/usermgmt/RoleFormModal';

const UserManagementPage = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [campuses, setCampuses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);

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

  return (
    <div className="w-full space-y-5">
      <UserMgmtHeader activeTab={activeTab} onSelectTab={(t) => { setActiveTab(t); setSelectedUser(null); }} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8 2xl:col-span-9 min-w-0">
          {activeTab === 'users' && (
            <UsersMgmtTab campuses={campuses} roles={roles} selectedUser={selectedUser} onSelectUser={setSelectedUser} onTotalChange={setTotalUsers} />
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
            onEditUser={() => setShowAddUser(true)}
            onResetPassword={() => {}}
            onAssignCampus={() => {}}
            onToggleStatus={() => {}}
            onDeleteUser={() => {}}
            roles={roles}
            campuses={campuses}
            totalUsers={totalUsers}
            onAddUser={() => setShowAddUser(true)}
            onAddRole={() => setShowAddRole(true)}
          />
        </div>
      </div>

      {showAddUser && (
        <UserFormModal user={selectedUser} roles={roles} campuses={campuses} token={token} onClose={() => setShowAddUser(false)} onSaved={() => { setShowAddUser(false); setSelectedUser(null); }} />
      )}
      {showAddRole && (
        <RoleFormModal token={token} campuses={campuses} onClose={() => setShowAddRole(false)} onSaved={() => { setShowAddRole(false); loadData(); }} />
      )}
    </div>
  );
};

export default UserManagementPage;
