export const resolveUserRole = (user) => {
  if (user.role === 'admin' || user.role === 'user') {
    return user.role;
  }

  if (user.isAdmin) {
    return 'admin';
  }

  return 'user';
};

export const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: resolveUserRole(user),
});
