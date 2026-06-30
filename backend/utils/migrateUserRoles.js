import User from '../models/userModel.js';

const migrateUserRoles = async () => {
  const needsMigration = await User.countDocuments({
    $or: [{ isAdmin: { $exists: true } }, { role: { $exists: false } }],
  });

  if (needsMigration === 0) return;

  await User.updateMany({ isAdmin: true }, { $set: { role: 'admin' } });
  await User.updateMany(
    { role: { $exists: false } },
    { $set: { role: 'user' } }
  );
  await User.updateMany({ isAdmin: { $exists: true } }, { $unset: { isAdmin: '' } });
};

export default migrateUserRoles;
