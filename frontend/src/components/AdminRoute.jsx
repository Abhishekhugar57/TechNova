import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAdminUser } from '../utils/authUtils';

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to='/login' replace />;
  }

  return isAdminUser(userInfo) ? (
    <Outlet />
  ) : (
    <Navigate to='/' replace />
  );
};

export default AdminRoute;
