import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaSearch,
  FaBell,
  FaMoon,
  FaSun,
  FaStore,
  FaSignOutAlt,
  FaChevronDown,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { formatPrice } from '../../utils/currencyUtils';

const getPageMeta = (pathname) => {
  if (pathname.includes('/product/create')) return { title: 'Add Product', breadcrumb: 'Products / New' };
  if (pathname.match(/\/product\/.+\/edit/)) return { title: 'Edit Product', breadcrumb: 'Products / Edit' };
  if (pathname.includes('/productlist')) return { title: 'Products', breadcrumb: 'Catalog management' };
  if (pathname.includes('/orderlist')) return { title: 'Orders', breadcrumb: 'Order management' };
  if (pathname.match(/\/user\/.+\/edit/)) return { title: 'Edit User', breadcrumb: 'Users / Edit' };
  if (pathname.includes('/userlist')) return { title: 'Users', breadcrumb: 'User management' };
  return { title: 'Dashboard', breadcrumb: 'Overview & analytics' };
};

const AdminHeader = ({ onMenuOpen, isDark, onToggleTheme, onLogout }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: orders } = useGetOrdersQuery(undefined, {
    refetchOnMountOrArgChange: 120,
  });

  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const { title, breadcrumb } = getPageMeta(location.pathname);
  const unpaidOrders = orders?.filter((o) => !o.isPaid) || [];
  const recentNotifs = unpaidOrders.slice(0, 5);
  const initial = userInfo?.name?.charAt(0)?.toUpperCase() || 'A';

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/admin/productlist', { state: { search: search.trim() } });
    setSearch('');
  };

  return (
    <header className='admin-header'>
      <div className='admin-header__left'>
        <button
          type='button'
          className='admin-header__btn d-lg-none'
          onClick={onMenuOpen}
          aria-label='Open navigation menu'
        >
          <FaBars />
        </button>
        <div>
          <h1 className='admin-header__title'>{title}</h1>
          <p className='admin-header__breadcrumb'>{breadcrumb}</p>
        </div>
      </div>

      <form className='admin-header__search' onSubmit={handleSearch} role='search'>
        <FaSearch className='admin-header__search-icon' aria-hidden='true' />
        <input
          type='search'
          placeholder='Search products...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label='Search products'
        />
      </form>

      <div className='admin-header__actions'>
        <button
          type='button'
          className='admin-header__btn'
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <FaSun /> : <FaMoon />}
        </button>

        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            type='button'
            className='admin-header__btn'
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label='Notifications'
            aria-expanded={notifOpen}
          >
            <FaBell />
            {unpaidOrders.length > 0 && (
              <span className='admin-header__badge'>{unpaidOrders.length}</span>
            )}
          </button>
          {notifOpen && (
            <div className='admin-header__notif-panel' role='dialog' aria-label='Notifications'>
              <div className='admin-header__notif-header'>
                Pending Payments ({unpaidOrders.length})
              </div>
              {recentNotifs.length === 0 ? (
                <p className='dash-empty'>No pending notifications</p>
              ) : (
                recentNotifs.map((order) => (
                  <Link
                    key={order._id}
                    to={`/order/${order._id}`}
                    className='admin-header__notif-item'
                    onClick={() => setNotifOpen(false)}
                    style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                  >
                    <strong>Order #{order._id.slice(-6)}</strong>
                    <div style={{ color: 'var(--admin-text-muted)', marginTop: 2 }}>
                      {order.user?.name} · {formatPrice(order.totalPrice)}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            type='button'
            className='admin-header__profile'
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label='Admin profile menu'
            aria-expanded={profileOpen}
          >
            <span className='admin-header__avatar'>{initial}</span>
            <div className='admin-header__profile-info'>
              <div className='admin-header__profile-name'>{userInfo?.name}</div>
              <div className='admin-header__profile-role'>Administrator</div>
            </div>
            <FaChevronDown size={10} style={{ color: 'var(--admin-text-muted)' }} />
          </button>
          {profileOpen && (
            <div className='admin-header__dropdown'>
              <Link to='/' onClick={() => setProfileOpen(false)}>
                <FaStore /> View Storefront
              </Link>
              <button type='button' onClick={() => { setProfileOpen(false); onLogout(); }}>
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
