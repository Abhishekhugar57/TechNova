import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  createOrderRazorpayOrder,
  verifyRazorpayPayment,
  updateOrderToDelivered,
  cancelMyOrder,
  getOrders,
  updateOrderTrackingStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, adminOnly, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/razorpay-order').post(protect, createOrderRazorpayOrder);
router.route('/:id/razorpay-verify').post(protect, verifyRazorpayPayment);
router.route('/:id/deliver').put(protect, adminOnly, updateOrderToDelivered);
router.route('/:id/cancel').put(protect, cancelMyOrder);
router.route('/:id/tracking').put(protect, adminOnly, updateOrderTrackingStatus);

export default router;
