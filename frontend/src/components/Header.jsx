import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes, FaHeart } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { useGetWishlistQuery } from '../slices/wishlistApiSlice';
import { logout } from '../slices/authSlice';
import { resetCart } from '../slices/cartSlice';
import logo from '../assets/logo.png';
import { SITE_NAME } from '../constants/site';
import { isAdminUser } from '../utils/authUtils';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [keyword, setKeyword] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);
  const showCart = !isAdminUser(userInfo);
  const showWishlist = !isAdminUser(userInfo);
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !userInfo || isAdminUser(userInfo),
  });
  const wishlistCount = wishlistData?.count ?? 0;

  const searchHandler = (e) => {
    e.preventDefault();
    setDrawerOpen(false);
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      setDrawerOpen(false);
      setProfileOpen(false);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const NavLinks = ({ mobile = false }) => (
    <>
      {userInfo && isAdminUser(userInfo) && (
        <Link
          to='/admin/dashboard'
          className={mobile ? '' : 'btn-outline-custom btn-sm-custom'}
          onClick={() => setDrawerOpen(false)}
        >
          Admin Panel
        </Link>
      )}
      {userInfo ? (
        <>
          <Link to='/wishlist' onClick={() => setDrawerOpen(false)}>
            My Wishlist
          </Link>
          <Link to='/profile' onClick={() => setDrawerOpen(false)}>
            Profile
          </Link>
          <button type='button' onClick={logoutHandler}>
            Logout
          </button>
        </>
      ) : (
        <Link
          to='/login'
          className={mobile ? '' : 'btn-outline-custom btn-sm-custom'}
          onClick={() => setDrawerOpen(false)}
        >
          Sign In
        </Link>
      )}
    </>
  );

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
      <div className='site-header__inner'>
        <button
          type='button'
          className='header-icon-btn d-lg-none'
          onClick={() => setDrawerOpen(true)}
          aria-label='Open menu'
        >
          <FaBars />
        </button>

        <Link to='/' className='site-header__brand'>
          <img src={logo} alt={SITE_NAME} />
          <span className='d-none d-sm-inline'>{SITE_NAME}</span>
        </Link>

        <form className='site-header__search d-none d-md-block' onSubmit={searchHandler}>
          <div className='input-group'>
            <input
              type='search'
              className='form-control'
              placeholder='Search products, brands and more...'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              aria-label='Search products'
            />
            <button type='submit' className='btn-accent' aria-label='Search'>
              <FaSearch />
            </button>
          </div>
        </form>

        <div className='site-header__actions'>
          {showWishlist && (
            <Link to='/wishlist' className='header-icon-btn' aria-label='Wishlist'>
              <FaHeart size={18} />
              {wishlistCount > 0 && <span className='cart-badge'>{wishlistCount}</span>}
            </Link>
          )}
          {showCart && (
            <Link to='/cart' className='header-icon-btn' aria-label='Cart'>
              <FaShoppingCart size={18} />
              {cartCount > 0 && <span className='cart-badge'>{cartCount}</span>}
            </Link>
          )}

          <div className='position-relative d-none d-lg-block'>
            <button
              type='button'
              className='header-icon-btn'
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label='Account menu'
              aria-expanded={profileOpen}
            >
              <FaUser size={18} />
            </button>
            {profileOpen && (
              <>
                <div
                  className='drawer-overlay open'
                  style={{ zIndex: 9 }}
                  onClick={() => setProfileOpen(false)}
                  aria-hidden='true'
                />
                <div className='dropdown-menu-custom card-surface card-surface--flat'>
                  {userInfo && (
                    <p className='dropdown-menu-custom__user'>{userInfo.name}</p>
                  )}
                  <NavLinks />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={`drawer-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />
      <nav
        className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}
        aria-label='Mobile navigation'
      >
        <div className='mobile-drawer__header'>
          <span>Menu</span>
          <button
            type='button'
            className='header-icon-btn'
            onClick={() => setDrawerOpen(false)}
            aria-label='Close menu'
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={searchHandler} className='mb-4'>
          <input
            type='search'
            className='form-control form-control-modern mb-2'
            placeholder='Search products...'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type='submit' className='btn-accent w-100'>
            Search
          </button>
        </form>
        <div className='mobile-drawer__nav'>
          <NavLinks mobile />
        </div>
      </nav>
    </header>
  );
};

export default Header;
