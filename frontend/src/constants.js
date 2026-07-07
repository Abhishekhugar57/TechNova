// Local dev uses the CRA proxy (frontend/package.json). Production uses REACT_APP_API_URL.
export const BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development' ? '' : '');
export const PRODUCTS_URL = '/api/products';
export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';
export const WISHLIST_URL = '/api/wishlist';
