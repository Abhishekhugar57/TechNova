import asyncHandler from '../middleware/asyncHandler.js';
import generateToken, { clearAuthCookie } from '../utils/generateToken.js';
import User from '../models/userModel.js';
import { formatUserResponse, resolveUserRole } from '../utils/userResponse.js';
import { findUserByEmail, normalizeEmail } from '../utils/emailUtils.js';

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await findUserByEmail(email);

  if (user && (await user.matchPassword(password))) {
    const role = resolveUserRole(user);
    const token = generateToken(res, user._id, role);

    res.json({ ...formatUserResponse(user), token });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const normalizedEmail = normalizeEmail(email);
  const userExists = await findUserByEmail(normalizedEmail);

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role: 'user',
  });

  if (user) {
    const token = generateToken(res, user._id, user.role);

    res.status(201).json({ ...formatUserResponse(user), token });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const logoutUser = (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ message: 'Logged out successfully' });
};

const getUserProfile = asyncHandler(async (req, res) => {
  res.json(formatUserResponse(req.user));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json(formatUserResponse(updatedUser));
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').lean();
  res.json(
    users.map((user) => ({
      ...user,
      role: resolveUserRole(user),
    }))
  );
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (resolveUserRole(user) === 'admin') {
      res.status(400);
      throw new Error('Can not delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json({
      ...user.toObject(),
      role: resolveUserRole(user),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.role === 'admin' || req.body.role === 'user') {
      user.role = req.body.role;
    }

    const updatedUser = await user.save();

    res.json(formatUserResponse(updatedUser));
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
