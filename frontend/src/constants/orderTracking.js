export const TRACKING_STATUSES = [
  'Order Placed',
  'Order Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export const FULFILLMENT_STATUSES = TRACKING_STATUSES.filter(
  (status) => status !== 'Cancelled'
);

export const TERMINAL_STATUSES = ['Delivered', 'Cancelled'];

export const VALID_TRANSITIONS = {
  'Order Placed': ['Order Confirmed', 'Cancelled'],
  'Order Confirmed': ['Packed', 'Cancelled'],
  Packed: ['Shipped', 'Cancelled'],
  Shipped: ['Out for Delivery', 'Cancelled'],
  'Out for Delivery': ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

export const TRACKING_STATUS_VARIANTS = {
  'Order Placed': 'info',
  'Order Confirmed': 'info',
  Packed: 'warning',
  Shipped: 'warning',
  'Out for Delivery': 'warning',
  Delivered: 'success',
  Cancelled: 'danger',
};

export const getTrackingStatusVariant = (status) =>
  TRACKING_STATUS_VARIANTS[status] || 'neutral';

export const getNextStatuses = (currentStatus) =>
  VALID_TRANSITIONS[currentStatus] || [];

export const canCancelOrder = (status) =>
  getNextStatuses(status).includes('Cancelled');

export const isActiveOrder = (status) =>
  status && !TERMINAL_STATUSES.includes(status);

export const formatTrackingDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTrackingDateShort = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const getTrackingProgress = (status) => {
  if (status === 'Cancelled') return 0;
  const index = FULFILLMENT_STATUSES.indexOf(status);
  if (index === -1) return 0;
  return Math.round((index / (FULFILLMENT_STATUSES.length - 1)) * 100);
};

export const getEstimatedDeliveryDate = (createdAt) => {
  if (!createdAt) return null;
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 7);
  return date;
};

export const formatEstimatedDelivery = (createdAt) => {
  const date = getEstimatedDeliveryDate(createdAt);
  if (!date) return null;
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};
