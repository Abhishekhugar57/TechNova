import Order from '../models/orderModel.js';

const DELIVERED_STATUS = 'Delivered';

const userHasPurchasedProduct = async (userId, productId) => {
  const orders = await Order.find({
    user: userId,
    'orderItems.product': productId,
  })
    .select('trackingStatus isDelivered')
    .lean();

  return orders;
};

const getReviewEligibilityForUser = async (userId, productId) => {
  const orders = await userHasPurchasedProduct(userId, productId);

  if (orders.length === 0) {
    return {
      canReview: false,
      reason: 'Product not purchased',
    };
  }

  const hasDeliveredOrder = orders.some(
    (order) =>
      order.trackingStatus === DELIVERED_STATUS || order.isDelivered === true
  );

  if (!hasDeliveredOrder) {
    return {
      canReview: false,
      reason: 'Order not delivered',
    };
  }

  return {
    canReview: true,
    reason: DELIVERED_STATUS,
  };
};

export { getReviewEligibilityForUser, DELIVERED_STATUS };
