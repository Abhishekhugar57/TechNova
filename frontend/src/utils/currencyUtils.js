export const USD_TO_INR_RATE = 86;

// Converted from former USD thresholds: free shipping over $100, flat $10 shipping.
export const FREE_SHIPPING_THRESHOLD = 100 * USD_TO_INR_RATE;
export const SHIPPING_COST = 10 * USD_TO_INR_RATE;

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
    Number(price)
  );
