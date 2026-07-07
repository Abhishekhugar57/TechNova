import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';

import { logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
});

const isAuthRequest = (args) => {
  const url = typeof args === 'string' ? args : args?.url || '';
  const method = typeof args === 'object' ? args?.method || 'GET' : 'GET';

  if (url.includes('/users/auth')) {
    return true;
  }

  return method === 'POST' && url === '/api/users';
};

async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);

  if (result.error && result.error.status === 401 && !isAuthRequest(args)) {
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
