import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import PageHeader from '../components/ui/PageHeader';
import WishlistItemCard from '../components/WishlistItemCard';
import ProductGrid from '../components/ui/ProductGrid';
import { useGetWishlistQuery } from '../slices/wishlistApiSlice';

const WishlistEmptyState = () => (
  <div className='wishlist-empty'>
    <div className='wishlist-empty__illustration' aria-hidden='true'>
      <FaHeart />
    </div>
    <h2>Your wishlist is empty</h2>
    <p>
      Save items you love by tapping the heart on any product. They&apos;ll show up here
      for easy access later.
    </p>
    <Link to='/' className='btn-primary-custom'>
      Continue Shopping
    </Link>
  </div>
);

const WishlistScreen = () => {
  const { data, isLoading, error } = useGetWishlistQuery();

  return (
    <div className='animate-in page-container page-section'>
      <Meta title='My Wishlist' description='Your saved products' />
      <PageHeader
        title='My Wishlist'
        subtitle={
          data?.count
            ? `${data.count} saved item${data.count === 1 ? '' : 's'}`
            : 'Products you have saved for later'
        }
      />

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : !data?.items?.length ? (
        <WishlistEmptyState />
      ) : (
        <ProductGrid className='wishlist-grid'>
          {data.items.map((item) => (
            <WishlistItemCard key={item._id} item={item} />
          ))}
        </ProductGrid>
      )}
    </div>
  );
};

export default WishlistScreen;
