import '../../assets/styles/admin-dashboard.css';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBox,
  FaShoppingBag,
  FaUsers,
  FaTachometerAlt,
  FaStore,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../slices/usersApiSlice';
import { logout } from '../../slices/authSlice';
import { resetCart } from '../../slices/cartSlice';
import { useAdminTheme } from '../../hooks/useAdminTheme';
import { SITE_NAME } from '../../constants/site';
import AdminHeader from '../admin/AdminHeader';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/admin/productlist', label: 'Products', icon: FaBox },
  { to: '/admin/orderlist', label: 'Orders', icon: FaShoppingBag },
  { to: '/admin/userlist', label: 'Users', icon: FaUsers },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();
  const { isDark, toggleTheme } = useAdminTheme();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (to) => {
    if (to === '/admin/dashboard') return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <div className='admin-shell'>
      <div
        className={`admin-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label='Admin navigation'>
        <div className='admin-sidebar__brand'>
          <div className='admin-sidebar__logo'>T</div>
          <div>
            <div className='admin-sidebar__brand-text'>{SITE_NAME}</div>
            <div className='admin-sidebar__brand-sub'>Admin Console</div>
          </div>
        </div>

        <nav className='admin-sidebar__nav'>
          <div className='admin-sidebar__section'>Main Menu</div>
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`admin-sidebar__link ${isActive(to) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon /> {label}
            </Link>
          ))}
        </nav>

        <div className='admin-sidebar__footer'>
          <Link to='/' className='admin-sidebar__link' onClick={() => setSidebarOpen(false)}>
            <FaStore /> View Store
          </Link>
          <button
            type='button'
            className='admin-sidebar__link'
            onClick={logoutHandler}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <div className='admin-content'>
        <AdminHeader
          onMenuOpen={() => setSidebarOpen(true)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onLogout={logoutHandler}
        />
        <main className='admin-page'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
