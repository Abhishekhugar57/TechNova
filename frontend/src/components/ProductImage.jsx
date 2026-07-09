import { useEffect, useState } from 'react';
import {
  normalizeProductImage,
  PRODUCT_IMAGE_FALLBACK,
} from '../utils/productImageUtils';

const ProductImage = ({
  src,
  alt = '',
  className = '',
  width = 800,
  height = 800,
  loading = 'lazy',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(() => normalizeProductImage(src));

  useEffect(() => {
    setImgSrc(normalizeProductImage(src));
  }, [src]);

  const handleError = () => {
    if (imgSrc !== PRODUCT_IMAGE_FALLBACK) {
      setImgSrc(PRODUCT_IMAGE_FALLBACK);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`product-image ${className}`.trim()}
      width={width}
      height={height}
      loading={loading}
      decoding='async'
      onError={handleError}
      {...props}
    />
  );
};

export default ProductImage;
