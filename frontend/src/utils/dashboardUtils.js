import { formatPrice } from './currencyUtils';

const MONTH_COUNT = 6;

export const getMonthlyAnalytics = (orders = []) => {
  const months = [];

  for (let i = MONTH_COUNT - 1; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.push({
      key,
      month: date.toLocaleString('default', { month: 'short' }),
      revenue: 0,
      orders: 0,
    });
  }

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const bucket = months.find((m) => m.key === key);
    if (!bucket) return;
    bucket.orders += 1;
    if (order.isPaid) bucket.revenue += order.totalPrice;
  });

  return months;
};

export const getGrowthPercent = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

export const getPeriodStats = (orders = []) => {
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  let currentRevenue = 0;
  let previousRevenue = 0;
  let currentOrders = 0;
  let previousOrders = 0;

  orders.forEach((order) => {
    const created = new Date(order.createdAt).getTime();
    const age = now - created;

    if (age <= thirtyDays) {
      currentOrders += 1;
      if (order.isPaid) currentRevenue += order.totalPrice;
    } else if (age <= thirtyDays * 2) {
      previousOrders += 1;
      if (order.isPaid) previousRevenue += order.totalPrice;
    }
  });

  return {
    revenueGrowth: getGrowthPercent(currentRevenue, previousRevenue),
    ordersGrowth: getGrowthPercent(currentOrders, previousOrders),
    currentRevenue,
    currentOrders,
  };
};

export const getRecentOrders = (orders = [], limit = 5) =>
  [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

export const getTopSellingProducts = (orders = [], limit = 5) => {
  const sales = {};

  orders.forEach((order) => {
    order.orderItems?.forEach((item) => {
      const key = item.product || item.name;
      if (!sales[key]) {
        sales[key] = { name: item.name, qty: 0, revenue: 0, image: item.image };
      }
      sales[key].qty += item.qty;
      sales[key].revenue += item.qty * item.price;
    });
  });

  return Object.values(sales)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit);
};

export const getRecentActivity = (orders = [], limit = 6) => {
  const events = [];

  orders.forEach((order) => {
    events.push({
      id: `${order._id}-created`,
      type: 'order',
      message: `New order from ${order.user?.name || 'Customer'}`,
      meta: formatPrice(order.totalPrice),
      date: order.createdAt,
    });
    if (order.isPaid) {
      events.push({
        id: `${order._id}-paid`,
        type: 'payment',
        message: `Payment received for order #${order._id.slice(-6)}`,
        meta: order.paymentMethod,
        date: order.paidAt || order.createdAt,
      });
    }
    if (order.isDelivered) {
      events.push({
        id: `${order._id}-delivered`,
        type: 'delivery',
        message: `Order #${order._id.slice(-6)} delivered`,
        meta: 'Completed',
        date: order.deliveredAt || order.updatedAt || order.createdAt,
      });
    }
  });

  return events
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

export const getLowStockProducts = (products = [], threshold = 10) =>
  products
    .filter((p) => p.countInStock <= threshold)
    .sort((a, b) => a.countInStock - b.countInStock)
    .slice(0, 5);
