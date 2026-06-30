const TRACKING_STATUSES = [
  'Order Placed',
  'Order Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const TERMINAL_STATUSES = ['Delivered', 'Cancelled'];

const VALID_TRANSITIONS = {
  'Order Placed': ['Order Confirmed', 'Cancelled'],
  'Order Confirmed': ['Packed', 'Cancelled'],
  Packed: ['Shipped', 'Cancelled'],
  Shipped: ['Out for Delivery', 'Cancelled'],
  'Out for Delivery': ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

const DEFAULT_DESCRIPTIONS = {
  'Order Placed': 'Your order has been placed successfully.',
  'Order Confirmed': 'Payment received. Your order is being processed.',
  Packed: 'Your items have been packed and are ready for dispatch.',
  Shipped: 'Your order has left our warehouse and is in transit.',
  'Out for Delivery': 'Your order is out for delivery and will arrive soon.',
  Delivered: 'Your order has been delivered successfully.',
  Cancelled: 'Your order has been cancelled.',
};

export {
  TRACKING_STATUSES,
  TERMINAL_STATUSES,
  VALID_TRANSITIONS,
  DEFAULT_DESCRIPTIONS,
};
