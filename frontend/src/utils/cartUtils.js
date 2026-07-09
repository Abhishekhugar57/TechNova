import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from './currencyUtils';

export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const TAX_RATE = 0.15;

// NOTE: the code below has been changed from the course code to fix an issue
// with type coercion of strings to numbers.
// Our addDecimals function expects a number and returns a string, so it is not
// correct to call it passing a string as the argument.

export const updateCart = (state) => {
  // Calculate the items price in whole number (pennies) to avoid issues with
  // floating point number calculations
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + (item.price * 100 * item.qty) / 100,
    0
  );
  state.itemsPrice = addDecimals(itemsPrice);

  // Calculate the shipping price
  const shippingPrice =
    itemsPrice > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  state.shippingPrice = addDecimals(shippingPrice);

  // Calculate the tax price
  const taxPrice = TAX_RATE * itemsPrice;
  state.taxPrice = addDecimals(taxPrice);

  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  // Calculate the total price
  state.totalPrice = addDecimals(totalPrice);

  // Save the cart to localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
