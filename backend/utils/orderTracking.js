import {
  TRACKING_STATUSES,
  VALID_TRANSITIONS,
  DEFAULT_DESCRIPTIONS,
} from '../constants/orderTracking.js';

const getDefaultLocation = (status, order) => {
  if (status === 'Order Placed' || status === 'Order Confirmed' || status === 'Packed') {
    return 'TechNova Fulfillment Center';
  }
  if (status === 'Delivered') {
    const addr = order?.shippingAddress;
    return addr ? `${addr.city}, ${addr.country}` : 'Delivery Address';
  }
  if (status === 'Cancelled') {
    return 'TechNova Fulfillment Center';
  }
  return 'In Transit';
};

const createTrackingEntry = (status, order, { description, location } = {}) => ({
  status,
  description: description || DEFAULT_DESCRIPTIONS[status] || status,
  location: location || getDefaultLocation(status, order),
  updatedAt: new Date(),
});

const appendTrackingHistory = (order, status, options = {}) => {
  const entry = createTrackingEntry(status, order, options);
  order.trackingStatus = status;
  if (!order.trackingHistory) {
    order.trackingHistory = [];
  }
  order.trackingHistory.push(entry);
  syncLegacyFields(order, status);
  return entry;
};

const syncLegacyFields = (order, status) => {
  if (status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = order.deliveredAt || new Date();
  }
  if (status === 'Cancelled') {
    order.paymentStatus = 'cancelled';
  }
};

const isValidTransition = (currentStatus, nextStatus) => {
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
};

const getNextStatuses = (currentStatus) => VALID_TRANSITIONS[currentStatus] || [];

const inferTrackingStatus = (order) => {
  if (order.trackingStatus) {
    return order.trackingStatus;
  }
  if (order.isDelivered) return 'Delivered';
  if (order.isPaid) return 'Order Confirmed';
  if (order.paymentStatus === 'cancelled') return 'Cancelled';
  return 'Order Placed';
};

const ensureTrackingFields = (order) => {
  if (!order) return order;

  const status = inferTrackingStatus(order);
  order.trackingStatus = status;

  if (!order.trackingHistory || order.trackingHistory.length === 0) {
    const history = [];
    const placedAt = order.createdAt || new Date();

    history.push({
      status: 'Order Placed',
      description: DEFAULT_DESCRIPTIONS['Order Placed'],
      location: 'TechNova Fulfillment Center',
      updatedAt: placedAt,
    });

    if (order.isPaid || status !== 'Order Placed') {
      history.push({
        status: 'Order Confirmed',
        description: DEFAULT_DESCRIPTIONS['Order Confirmed'],
        location: 'TechNova Fulfillment Center',
        updatedAt: order.paidAt || placedAt,
      });
    }

    if (order.isDelivered || status === 'Delivered') {
      history.push({
        status: 'Delivered',
        description: DEFAULT_DESCRIPTIONS.Delivered,
        location: getDefaultLocation('Delivered', order),
        updatedAt: order.deliveredAt || order.updatedAt || placedAt,
      });
    }

    if (status === 'Cancelled') {
      history.push({
        status: 'Cancelled',
        description: DEFAULT_DESCRIPTIONS.Cancelled,
        location: 'TechNova Fulfillment Center',
        updatedAt: order.updatedAt || placedAt,
      });
    }

    order.trackingHistory = history;
  }

  return order;
};

export {
  TRACKING_STATUSES,
  createTrackingEntry,
  appendTrackingHistory,
  isValidTransition,
  getNextStatuses,
  ensureTrackingFields,
  inferTrackingStatus,
};
