import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getProductCategories,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(getProducts).post(protect, adminOnly, createProduct);
router.get('/categories', getProductCategories);
router.get('/top', getTopProducts);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);
router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, adminOnly, checkObjectId, updateProduct)
  .delete(protect, adminOnly, checkObjectId, deleteProduct);

export default router;
