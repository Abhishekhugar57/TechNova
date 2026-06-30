import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { ORDER_LIST_FIELDS } from '../utils/queryFields.js';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  fetchRazorpayPayment,
  checkIfNewRazorpayPayment,
  isRazorpayConfigured,
  toRazorpayAmount,
} from '../utils/razorpay.js';
import {
  appendTrackingHistory,
  ensureTrackingFields,
  isValidTransition,
  getNextStatuses,
} from '../utils/orderTracking.js';

const assertOrderOwnership = (order, user, res) => {
  const orderUserId = order.user._id
    ? order.user._id.toString()
    : order.user.toString();

  if (orderUserId !== user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this order');
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  if (req.user.role === 'admin') {
    res.status(403);
    throw new Error('Admin users cannot place orders');
  }

  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // NOTE: here we must assume that the prices from our client are incorrect.
    // We must only trust the price of the item as it exists in
    // our DB. This prevents a user paying whatever they want by hacking our client
    // side code - https://gist.github.com/bushblade/725780e6043eaf59415fbaf6ca7376ff

    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    })
      .select('price')
      .lean();

    if (itemsFromDB.length !== orderItems.length) {
      res.status(400);
      throw new Error(
        'One or more products in your cart are no longer available. Please clear your cart and add items again.'
      );
    }

    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    // calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentStatus: 'pending',
      trackingStatus: 'Order Placed',
      trackingHistory: [],
    });

    appendTrackingHistory(order, 'Order Placed');

    const createdOrder = await order.save();

    res.status(201).json(ensureTrackingFields(createdOrder.toObject()));
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .select(ORDER_LIST_FIELDS)
    .sort({ createdAt: -1 })
    .lean();
  res.json(orders.map((order) => ensureTrackingFields(order)));
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .lean();

  if (order) {
    if (req.user.role !== 'admin') {
      assertOrderOwnership(order, req.user, res);
    }
    res.json(ensureTrackingFields(order));
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Create Razorpay order for an existing order
// @route   POST /api/orders/:id/razorpay-order
// @access  Private
const createOrderRazorpayOrder = asyncHandler(async (req, res) => {
  if (!isRazorpayConfigured()) {
    res.status(503);
    throw new Error('Razorpay is not configured');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  assertOrderOwnership(order, req.user, res);

  if (req.user.role === 'admin') {
    res.status(403);
    throw new Error('Admin users cannot pay for orders');
  }

  if (order.isPaid || order.paymentStatus === 'paid') {
    res.status(400);
    throw new Error('Order is already paid');
  }

  if (order.paymentMethod !== 'Razorpay') {
    res.status(400);
    throw new Error('This order does not use Razorpay as the payment method');
  }

  if (!order.totalPrice || order.totalPrice <= 0) {
    res.status(400);
    throw new Error('Invalid order amount');
  }

  const razorpayOrder = await createRazorpayOrder(
    order.totalPrice,
    order._id.toString()
  );

  order.razorpayOrderId = razorpayOrder.id;
  order.paymentStatus = 'pending';
  await order.save();

  res.json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    amountInInr: razorpayOrder.amount / 100,
  });
});

// @desc    Verify Razorpay payment and mark order as paid
// @route   POST /api/orders/:id/razorpay-verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  if (!isRazorpayConfigured()) {
    res.status(503);
    throw new Error('Razorpay is not configured');
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    res.status(400);
    throw new Error('Missing Razorpay payment details');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  assertOrderOwnership(order, req.user, res);

  if (req.user.role === 'admin') {
    res.status(403);
    throw new Error('Admin users cannot pay for orders');
  }

  if (order.isPaid || order.paymentStatus === 'paid') {
    res.status(400);
    throw new Error('Order is already paid');
  }

  if (!order.razorpayOrderId || order.razorpayOrderId !== razorpayOrderId) {
    res.status(400);
    throw new Error('Razorpay order ID does not match');
  }

  const isSignatureValid = verifyRazorpaySignature(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  );

  if (!isSignatureValid) {
    order.paymentStatus = 'failed';
    await order.save();
    res.status(400);
    throw new Error('Payment verification failed');
  }

  const isNewPayment = await checkIfNewRazorpayPayment(razorpayPaymentId);
  if (!isNewPayment) {
    res.status(400);
    throw new Error('Payment has already been used');
  }

  const payment = await fetchRazorpayPayment(razorpayPaymentId);

  if (payment.order_id !== razorpayOrderId) {
    res.status(400);
    throw new Error('Payment does not belong to this Razorpay order');
  }

  if (payment.amount !== toRazorpayAmount(order.totalPrice)) {
    res.status(400);
    throw new Error('Incorrect amount paid');
  }

  if (payment.status !== 'captured' && payment.status !== 'authorized') {
    res.status(400);
    throw new Error('Payment was not successful');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentStatus = 'paid';
  order.razorpayOrderId = razorpayOrderId;
  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;
  order.paymentResult = {
    id: razorpayPaymentId,
    status: payment.status,
    email_address: req.user.email,
  };

  if (order.trackingStatus === 'Order Placed') {
    appendTrackingHistory(order, 'Order Confirmed');
  }

  const updatedOrder = await order.save();

  res.json(ensureTrackingFields(updatedOrder.toObject()));
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const currentStatus = order.trackingStatus || 'Order Placed';

  if (currentStatus === 'Delivered') {
    res.json(ensureTrackingFields(order.toObject()));
    return;
  }

  if (!isValidTransition(currentStatus, 'Delivered')) {
    const nextOptions = getNextStatuses(currentStatus);
    res.status(400);
    throw new Error(
      `Cannot deliver from "${currentStatus}". Valid next statuses: ${nextOptions.join(', ') || 'none'}`
    );
  }

  appendTrackingHistory(order, 'Delivered');

  const updatedOrder = await order.save();

  res.json(ensureTrackingFields(updatedOrder.toObject()));
});

// @desc    Cancel order (customer)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelMyOrder = asyncHandler(async (req, res) => {
  if (req.user.role === 'admin') {
    res.status(403);
    throw new Error('Admins must use the tracking update panel to cancel orders');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  assertOrderOwnership(order, req.user, res);

  const currentStatus = order.trackingStatus || 'Order Placed';

  if (currentStatus === 'Cancelled') {
    res.status(400);
    throw new Error('Order is already cancelled');
  }

  if (!isValidTransition(currentStatus, 'Cancelled')) {
    res.status(400);
    throw new Error(`Cannot cancel order at "${currentStatus}" stage`);
  }

  const { reason } = req.body;
  appendTrackingHistory(order, 'Cancelled', {
    description: reason?.trim() || 'Cancelled by customer',
  });

  const updatedOrder = await order.save();

  res.json(ensureTrackingFields(updatedOrder.toObject()));
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .select(ORDER_LIST_FIELDS)
    .sort({ createdAt: -1 })
    .populate('user', 'name')
    .lean();
  res.json(orders.map((order) => ensureTrackingFields(order)));
});

// @desc    Update order tracking status
// @route   PUT /api/orders/:id/tracking
// @access  Private/Admin
const updateOrderTrackingStatus = asyncHandler(async (req, res) => {
  const { status, description, location } = req.body;

  if (!status) {
    res.status(400);
    throw new Error('Tracking status is required');
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const currentStatus = order.trackingStatus || 'Order Placed';

  if (currentStatus === status) {
    res.status(400);
    throw new Error('Order is already at this tracking status');
  }

  if (!isValidTransition(currentStatus, status)) {
    const nextOptions = getNextStatuses(currentStatus);
    res.status(400);
    throw new Error(
      `Cannot move from "${currentStatus}" to "${status}". Valid next statuses: ${nextOptions.join(', ') || 'none'}`
    );
  }

  if (status === 'Order Confirmed' && !order.isPaid) {
    res.status(400);
    throw new Error('Order must be paid before it can be confirmed');
  }

  appendTrackingHistory(order, status, { description, location });

  const updatedOrder = await order.save();

  res.json(ensureTrackingFields(updatedOrder.toObject()));
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  createOrderRazorpayOrder,
  verifyRazorpayPayment,
  updateOrderToDelivered,
  cancelMyOrder,
  getOrders,
  updateOrderTrackingStatus,
};
