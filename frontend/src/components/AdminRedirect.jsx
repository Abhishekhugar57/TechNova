import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAdminUser } from '../utils/authUtils';

const AdminRedirect = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (isAdminUser(userInfo)) {
    return <Navigate to='/admin/dashboard' replace />;
  }

  return children;
};

export default AdminRedirect;
