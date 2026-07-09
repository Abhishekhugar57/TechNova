import { memo } from 'react';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import Rating from './Rating';
import ProductImage from './ProductImage';
import WishlistButton from './WishlistButton';
import { formatPrice } from '../utils/currencyUtils';

const Product = ({ product }) => {
  return (
    <article className='product-card'>
      <div className='product-card__image-wrap'>
        <Link
          to={`/product/${product._id}`}
          className='product-card__image-link'
          aria-label={product.name}
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
          />
        </Link>
        <WishlistButton productId={product._id} size={14} variant='card' />
      </div>

      <div className='product-card__body'>
        <div className='product-card__top'>
          <div
            className='product-card__brand'
            aria-hidden={!product.brand}
          >
            {product.brand || '\u00A0'}
          </div>
          <Link to={`/product/${product._id}`} className='product-card__title-link'>
            <h3 className='product-title'>{product.name}</h3>
          </Link>
          <div className='product-card__rating'>
            <Rating value={product.rating} text={`(${product.numReviews})`} />
          </div>
        </div>

        <div className='product-card__footer'>
          <div className='product-card__price'>{formatPrice(product.price)}</div>
          <div className='product-card__actions'>
            <Link
              to={`/product/${product._id}`}
              className='btn-outline-custom btn-sm-custom w-100 product-card__view-btn'
              aria-label={`View details for ${product.name}`}
            >
              <FaEye aria-hidden='true' />
              <span className='product-card__view-label product-card__view-label--short'>View</span>
              <span className='product-card__view-label product-card__view-label--full'>View Details</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default memo(Product);
