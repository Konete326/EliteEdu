import { useAuth } from '../../context/AuthContext';
import AccountDetailsCard from '../../components/profile/AccountDetailsCard';
import PermissionsMatrixCard from '../../components/profile/PermissionsMatrixCard';

const MyProfilePage = () => {
  const { user, updateUser } = useAuth();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 xl:col-span-4">
          <AccountDetailsCard user={user} onUserUpdated={updateUser} />
        </div>
        <div className="lg:col-span-7 xl:col-span-8">
          <PermissionsMatrixCard user={user} />
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
