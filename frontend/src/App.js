import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  if (isAdminRoute) {
    return (
      <>
        <ToastContainer position='top-right' autoClose={3000} />
        <Suspense fallback={<PageLoader />}>
          <AdminLayout />
        </Suspense>
      </>
    );
  }

  return (
    <>
      <ToastContainer position='top-right' autoClose={3000} />
      <Header />
      <main className={`store-main ${isHome ? 'store-main--home' : 'store-main--default'}`}>
        {isHome || isAuthPage ? (
          <Outlet />
        ) : (
          <div className='page-container'>
            <Outlet />
          </div>
        )}
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
};

export default App;
