import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaEye, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ProductImage from './ProductImage';
import Rating from './Rating';
import WishlistButton from './WishlistButton';
import { addToCart } from '../slices/cartSlice';
import { useRemoveFromWishlistMutation } from '../slices/wishlistApiSlice';
import { formatPrice } from '../utils/currencyUtils';

const WishlistItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const [removeFromWishlist, { isLoading: removing }] = useRemoveFromWishlistMutation();
  const product = item.product;
  const outOfStock = product.countInStock === 0;

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success('Added to cart');
  };

  const handleRemove = async () => {
    try {
      await removeFromWishlist(product._id).unwrap();
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to remove item');
    }
  };

  return (
    <article className='wishlist-card'>
      <div className='wishlist-card__image-wrap'>
        <Link to={`/product/${product._id}`} aria-label={product.name}>
          <ProductImage
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
          />
        </Link>
        <WishlistButton productId={product._id} size={14} />
        {outOfStock && (
          <span className='wishlist-card__stock-badge'>Out of Stock</span>
        )}
      </div>

      <div className='wishlist-card__body'>
        <div className='wishlist-card__top'>
          {product.brand && (
            <div className='wishlist-card__brand'>{product.brand}</div>
          )}
          <Link to={`/product/${product._id}`} className='wishlist-card__title-link'>
            <h3 className='wishlist-card__title'>{product.name}</h3>
          </Link>
          <div className='wishlist-card__rating'>
            <Rating value={product.rating} text={`(${product.numReviews})`} />
          </div>
        </div>

        <div className='wishlist-card__footer'>
          <div className='wishlist-card__price-row'>
            <span className='wishlist-card__price'>{formatPrice(product.price)}</span>
            {!outOfStock && (
              <span className='badge-pill badge-pill--success wishlist-card__in-stock'>
                In Stock
              </span>
            )}
          </div>

          <div className='wishlist-card__actions'>
            <Link
              to={`/product/${product._id}`}
              className='btn-outline-custom btn-sm-custom'
            >
              <FaEye /> View
            </Link>
            <button
              type='button'
              className='btn-primary-custom btn-sm-custom'
              disabled={outOfStock}
              onClick={handleAddToCart}
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              type='button'
              className='btn-outline-custom btn-sm-custom wishlist-card__remove-btn'
              disabled={removing}
              onClick={handleRemove}
            >
              <FaTrash /> Remove
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default WishlistItemCard;
