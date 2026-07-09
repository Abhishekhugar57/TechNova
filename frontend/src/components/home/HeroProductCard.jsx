import { Link } from 'react-router-dom';
import ProductImage from '../ProductImage';
import Rating from '../Rating';
import { formatPrice } from '../../utils/currencyUtils';
import { getProductDiscountPercent } from '../../utils/productDiscountUtils';

const HeroProductCard = ({ product, priority = false, isInteractive = true }) => {
  const discount = getProductDiscountPercent(product);

  return (
    <Link
      to={`/product/${product._id}`}
      className='hero-product-card hero-product-card--featured'
      tabIndex={isInteractive ? 0 : -1}
      aria-label={`View ${product.name}, ${formatPrice(product.price)}`}
    >
      <div className='hero-product-card__image-wrap'>
        <ProductImage
          src={product.image}
          alt={product.name}
          className='hero-product-card__image'
          width={480}
          height={480}
          loading={priority ? 'eager' : 'lazy'}
        />
        {discount ? (
          <span className='hero-product-card__badge'>{discount}% OFF</span>
        ) : null}
      </div>
      <div className='hero-product-card__body'>
        <h3 className='hero-product-card__name'>{product.name}</h3>
        <div className='hero-product-card__meta'>
          <span className='hero-product-card__price'>{formatPrice(product.price)}</span>
          <Rating value={product.rating} text={`(${product.numReviews})`} />
        </div>
      </div>
    </Link>
  );
};

export default HeroProductCard;
