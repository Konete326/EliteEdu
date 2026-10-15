import { useAuth } from '../../context/AuthContext';
import AccountDetailsCard from '../../components/profile/AccountDetailsCard';
import PermissionsMatrixCard from '../../components/profile/PermissionsMatrixCard';

const MyProfilePage = () => {
  const { user, updateUser } = useAuth();

  return (
    <div className="w-full flex flex-col xl:flex-row items-start gap-4">
      <div className="w-full xl:w-[33%] shrink-0">
        <AccountDetailsCard user={user} onUserUpdated={updateUser} />
      </div>
      <div className="w-full xl:w-[67%] min-w-0">
        <PermissionsMatrixCard user={user} />
      </div>
    </div>
  );
};

export default MyProfilePage;
