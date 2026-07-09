export const getProductDiscountPercent = (product) => {
  if (!product) return null;

  if (typeof product.discountPercent === 'number' && product.discountPercent > 0) {
    return Math.round(product.discountPercent);
  }

  if (
    typeof product.originalPrice === 'number' &&
    product.originalPrice > product.price
  ) {
    return Math.round((1 - product.price / product.originalPrice) * 100);
  }

  return null;
};
