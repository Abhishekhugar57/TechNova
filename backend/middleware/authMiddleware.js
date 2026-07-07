import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';
import { resolveUserRole } from '../utils/userResponse.js';

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    req.user = user;
    req.user.role = resolveUserRole(user);
    next();
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
    return;
  }

  res.status(req.user ? 403 : 401);
  throw new Error(
    req.user ? 'Not authorized as an admin' : 'Not authorized, no token'
  );
};

export { protect, adminOnly };
