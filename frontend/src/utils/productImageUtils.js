export const PRODUCT_IMAGE_FALLBACK = '/images/products/fallback.webp';

export const normalizeProductImage = (src) => {
  if (!src || typeof src !== 'string') {
    return PRODUCT_IMAGE_FALLBACK;
  }
  return src;
};
