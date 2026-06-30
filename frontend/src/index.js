import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import App from './App';
import { lazyPage } from './utils/lazyPage';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PrivateRoute from './components/PrivateRoute';
import CustomerRoute from './components/CustomerRoute';
import AdminRoute from './components/AdminRoute';
import AdminRedirect from './components/AdminRedirect';
import './slices/wishlistApiSlice';
import store from './store';
import { Provider } from 'react-redux';

const HomeScreen = lazyPage(() => import('./screens/HomeScreen'));
const ProductScreen = lazyPage(() => import('./screens/ProductScreen'));
const CartScreen = lazyPage(() => import('./screens/CartScreen'));
const LoginScreen = lazyPage(() => import('./screens/LoginScreen'));
const RegisterScreen = lazyPage(() => import('./screens/RegisterScreen'));
const ShippingScreen = lazyPage(() => import('./screens/ShippingScreen'));
const PaymentScreen = lazyPage(() => import('./screens/PaymentScreen'));
const PlaceOrderScreen = lazyPage(() => import('./screens/PlaceOrderScreen'));
const OrderScreen = lazyPage(() => import('./screens/OrderScreen'));
const ProfileScreen = lazyPage(() => import('./screens/ProfileScreen'));
const WishlistScreen = lazyPage(() => import('./screens/WishlistScreen'));
const AdminDashboardScreen = lazyPage(() => import('./screens/admin/AdminDashboardScreen'));
const OrderListScreen = lazyPage(() => import('./screens/admin/OrderListScreen'));
const ProductListScreen = lazyPage(() => import('./screens/admin/ProductListScreen'));
const ProductEditScreen = lazyPage(() => import('./screens/admin/ProductEditScreen'));
const ProductCreateScreen = lazyPage(() => import('./screens/admin/ProductCreateScreen'));
const UserListScreen = lazyPage(() => import('./screens/admin/UserListScreen'));
const UserEditScreen = lazyPage(() => import('./screens/admin/UserEditScreen'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path='/category/:categorySlug' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route
        path='/search/:keyword/page/:pageNumber'
        element={<HomeScreen />}
      />
      <Route
        path='/category/:categorySlug/page/:pageNumber'
        element={<HomeScreen />}
      />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route
        path='/cart'
        element={
          <AdminRedirect>
            <CartScreen />
          </AdminRedirect>
        }
      />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='' element={<CustomerRoute />}>
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
      </Route>
      <Route path='' element={<PrivateRoute />}>
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/wishlist' element={<WishlistScreen />} />
      </Route>
      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/dashboard' element={<AdminDashboardScreen />} />
        <Route path='/admin/orderlist' element={<OrderListScreen />} />
        <Route path='/admin/productlist' element={<ProductListScreen />} />
        <Route
          path='/admin/productlist/:pageNumber'
          element={<ProductListScreen />}
        />
        <Route path='/admin/userlist' element={<UserListScreen />} />
        <Route path='/admin/product/create' element={<ProductCreateScreen />} />
        <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
        <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
