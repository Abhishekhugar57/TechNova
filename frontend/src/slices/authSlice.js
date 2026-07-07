import { createSlice } from '@reduxjs/toolkit';
import { normalizeUserInfo } from '../utils/authUtils';

const initialState = {
  userInfo: normalizeUserInfo(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  ),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, ...userInfo } = action.payload;
      state.userInfo = normalizeUserInfo(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      if (token) {
        localStorage.setItem('jwtToken', token);
      }
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('jwtToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
