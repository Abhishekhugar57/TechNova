import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAdminUser } from '../utils/authUtils';

const CustomerRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to='/login' replace />;
  }

  if (isAdminUser(userInfo)) {
    return <Navigate to='/admin/dashboard' replace />;
  }

  return <Outlet />;
};

export default CustomerRoute;
