import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

import { logout } from './authSlice'; // Import the logout action

// NOTE: code here has changed to handle when our JWT and Cookie expire.
// We need to customize the baseQuery to be able to intercept any 401 responses
// and log the user out
// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#customizing-queries-with-basequery

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
});

const isLoginRequest = (args) => {
  const url = typeof args === 'string' ? args : args?.url || '';
  return url.includes('/users/auth');
};

async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);

  // Only log out when an authenticated session expires — not on failed login.
  if (result.error && result.error.status === 401 && !isLoginRequest(args)) {
    api.dispatch(logout());
  }

  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product', 'Products', 'Order', 'User', 'Wishlist'],
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({}),
});
