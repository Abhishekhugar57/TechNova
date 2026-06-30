import User from '../models/userModel.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const findUserByEmail = (email) => {
  const normalizedEmail = email?.trim();

  if (!normalizedEmail) {
    return null;
  }

  return User.findOne({
    email: {
      $regex: new RegExp(`^${escapeRegex(normalizedEmail)}$`, 'i'),
    },
  });
};

export const normalizeEmail = (email) => email?.trim().toLowerCase();
