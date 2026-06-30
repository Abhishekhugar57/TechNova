import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from '../slices/wishlistApiSlice';
import { isAdminUser } from '../utils/authUtils';

const WishlistButton = ({
  productId,
  size = 14,
  className = '',
  variant = 'card',
  showLabel = false,
}) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const isCustomer = userInfo && !isAdminUser(userInfo);

  const { data: wishlist } = useGetWishlistQuery(undefined, {
    skip: !isCustomer,
  });
  const [addToWishlist, { isLoading: adding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: removing }] = useRemoveFromWishlistMutation();

  const isInWishlist =
    wishlist?.productIds?.some((id) => String(id) === String(productId)) ?? false;
  const isLoading = adding || removing;

  const handleToggle = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!userInfo) {
        toast.info('Please sign in to save items to your wishlist');
        navigate('/login');
        return;
      }

      if (isAdminUser(userInfo)) {
        toast.info('Wishlist is available for customer accounts only');
        return;
      }

      try {
        if (isInWishlist) {
          await removeFromWishlist(productId).unwrap();
          toast.success('Removed from wishlist');
        } else {
          await addToWishlist(productId).unwrap();
          toast.success('Added to wishlist');
        }
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to update wishlist');
      }
    },
    [userInfo, isInWishlist, productId, addToWishlist, removeFromWishlist, navigate]
  );

  const Icon = isInWishlist ? FaHeart : FaRegHeart;
  const label = isInWishlist ? 'Remove from wishlist' : 'Add to wishlist';

  return (
    <button
      type='button'
      className={`wishlist-btn wishlist-btn--${variant} ${
        isInWishlist ? 'wishlist-btn--active' : ''
      } ${className}`.trim()}
      aria-label={label}
      aria-pressed={isInWishlist}
      disabled={isLoading}
      onClick={handleToggle}
    >
      <Icon size={size} className='wishlist-btn__icon' />
      {showLabel && <span className='wishlist-btn__label'>{label}</span>}
    </button>
  );
};

export default WishlistButton;
