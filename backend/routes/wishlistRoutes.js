import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlistStatus,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getWishlist).post(protect, addToWishlist);
router.route('/status/:productId').get(protect, getWishlistStatus);
router.route('/:productId').delete(protect, removeFromWishlist);

export default router;
