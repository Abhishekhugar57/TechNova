export const normalizeUserInfo = (userInfo) => {
  if (!userInfo) {
    return null;
  }

  if (userInfo.role === 'admin' || userInfo.role === 'user') {
    return userInfo;
  }

  return {
    ...userInfo,
    role: userInfo.isAdmin ? 'admin' : 'user',
  };
};

export const isAdminUser = (userInfo) =>
  normalizeUserInfo(userInfo)?.role === 'admin';

export const getAuthRedirectPath = (userInfo, redirectParam) => {
  if (isAdminUser(userInfo)) {
    return '/admin/dashboard';
  }

  return redirectParam || '/';
};
