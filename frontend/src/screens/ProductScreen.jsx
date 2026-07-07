import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaMinus, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useGetReviewEligibilityQuery,
  useDeleteProductMutation,
  useGetProductsQuery,
} from '../slices/productsApiSlice';
import Product from '../components/Product';
import ProductImage from '../components/ProductImage';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import ProductDetailSkeleton from '../components/ui/ProductDetailSkeleton';
import Message from '../components/Message';
import Meta from '../components/Meta';
import ConfirmModal from '../components/ConfirmModal';
import SectionHeader from '../components/ui/SectionHeader';
import ProductGrid from '../components/ui/ProductGrid';
import WishlistButton from '../components/WishlistButton';
import { addToCart } from '../slices/cartSlice';
import { isAdminUser } from '../utils/authUtils';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: product, isLoading, refetch, error } =
    useGetProductDetailsQuery(productId);

  const { data: allProducts } = useGetProductsQuery(
    { pageNumber: 1 },
    { skip: !product }
  );

  const { userInfo } = useSelector((state) => state.auth);
  const adminView = isAdminUser(userInfo);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();
  const { data: reviewEligibility, isLoading: loadingReviewEligibility } =
    useGetReviewEligibilityQuery(productId, {
      skip: !userInfo || adminView,
    });
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const existingReview = reviewEligibility?.existingReview;
  const isEditingReview = Boolean(existingReview);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    }
  }, [existingReview]);

  const images = product ? [product.image, product.image, product.image] : [];

  const relatedProducts =
    allProducts?.products
      ?.filter((p) => p._id !== productId && p.category === product?.category)
      ?.slice(0, 4) || [];

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success(
        isEditingReview ? 'Review updated successfully' : 'Review created successfully'
      );
      if (!isEditingReview) {
        setComment('');
        setRating(0);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const getReviewFormMessage = () => {
    if (!userInfo) {
      return (
        <Message>
          Please <Link to='/login' className='text-link'>sign in</Link> to write a review
        </Message>
      );
    }

    if (loadingReviewEligibility) {
      return <Loader size='small' />;
    }

    if (!reviewEligibility?.canReview) {
      if (reviewEligibility?.reason === 'Product not purchased') {
        return (
          <Message>
            Reviews are available only after you receive this product.
          </Message>
        );
      }

      if (reviewEligibility?.reason === 'Order not delivered') {
        return (
          <Message>
            You can review this product after it has been delivered.
          </Message>
        );
      }

      return (
        <Message>
          Reviews are available only after you receive this product.
        </Message>
      );
    }

    return (
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3'>
          <Form.Label>Rating</Form.Label>
          <Form.Select className='form-control-modern' required value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value=''>Select rating...</option>
            <option value='1'>1 - Poor</option>
            <option value='2'>2 - Fair</option>
            <option value='3'>3 - Good</option>
            <option value='4'>4 - Very Good</option>
            <option value='5'>5 - Excellent</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Comment</Form.Label>
          <Form.Control as='textarea' rows={3} className='form-control-modern' required value={comment} onChange={(e) => setComment(e.target.value)} />
        </Form.Group>
        <button type='submit' className='btn-accent' disabled={loadingProductReview}>
          {isEditingReview ? 'Update Review' : 'Submit Review'}
        </button>
      </Form>
    );
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success('Product deleted successfully');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='animate-in'>
      <Link to='/' className='btn-outline-custom page-back-link'>
        &larr; Back to Shop
      </Link>

      {isLoading ? (
        <ProductDetailSkeleton />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />
          <Row className='g-4 mb-5'>
            <Col lg={6}>
              <div className='product-detail__gallery'>
                <ProductImage
                  src={images[activeImage]}
                  alt={product.name}
                  className='product-detail__main-image'
                />
                {!adminView && (
                  <WishlistButton
                    productId={product._id}
                    size={18}
                    variant='detail'
                  />
                )}
              </div>
              <div className='product-detail__thumbs'>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type='button'
                    className={`product-detail__thumb ${activeImage === idx ? 'active' : ''}`}
                    onClick={() => setActiveImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <ProductImage src={img} alt='' width={120} height={120} />
                  </button>
                ))}
              </div>
            </Col>

            <Col lg={6}>
              {product.brand && (
                <span className='badge-pill badge-pill--neutral mb-2'>{product.brand}</span>
              )}
              <h1 className='product-detail__title'>{product.name}</h1>
              <div className='my-2'>
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              </div>
              <div className='product-detail__price my-3'>${product.price}</div>
              <p className='product-detail__description'>{product.description}</p>

              <div className='my-3'>
                {product.countInStock > 0 ? (
                  <span className='badge-pill badge-pill--success'>
                    In Stock ({product.countInStock} available)
                  </span>
                ) : (
                  <span className='badge-pill badge-pill--danger'>Out of Stock</span>
                )}
              </div>

              <div className='card-surface card-surface--flat card-surface__body mt-4'>
                {adminView ? (
                  <div className='d-grid gap-2'>
                    <Link to={`/admin/product/${product._id}/edit`} className='btn-primary-custom text-center'>
                      <FaEdit className='me-1' /> Edit Product
                    </Link>
                    <button
                      type='button'
                      className='btn-danger-custom w-100'
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <FaTrash className='me-1' /> Delete Product
                    </button>
                  </div>
                ) : (
                  <>
                    {product.countInStock > 0 && (
                      <div className='d-flex align-items-center gap-3 mb-3'>
                        <span className='fw-semibold'>Quantity</span>
                        <div className='qty-selector'>
                          <button type='button' onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1} aria-label='Decrease'>
                            <FaMinus size={10} />
                          </button>
                          <span>{qty}</span>
                          <button type='button' onClick={() => setQty(Math.min(product.countInStock, qty + 1))} disabled={qty >= product.countInStock} aria-label='Increase'>
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </div>
                    )}
                    <button
                      type='button'
                      className='btn-primary-custom w-100'
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      <FaShoppingCart className='me-2' /> Add to Cart
                    </button>
                  </>
                )}
              </div>
            </Col>
          </Row>

          <section className='mb-5'>
            <SectionHeader title='Customer Reviews' subtitle={`${product.numReviews} reviews`} />
            {product.reviews.length === 0 && <Message>No reviews yet</Message>}
            <Row className='g-3'>
              {product.reviews.map((review) => (
                <Col key={review._id} md={6}>
                  <div className='review-card'>
                    <div className='review-card__meta'>
                      <strong>{review.name}</strong>
                      <small className='review-card__date'>
                        {review.createdAt.substring(0, 10)}
                      </small>
                    </div>
                    <Rating value={review.rating} />
                    <p className='review-card__comment'>{review.comment}</p>
                  </div>
                </Col>
              ))}
            </Row>

            {!adminView && (
              <div className='card-surface card-surface--flat card-surface__body mt-4'>
                <h5 className='card-surface__title'>
                  {isEditingReview ? 'Edit Your Review' : 'Write a Review'}
                </h5>
                {loadingProductReview && <Loader size='small' />}
                {getReviewFormMessage()}
              </div>
            )}
          </section>

          {relatedProducts.length > 0 && (
            <section>
              <SectionHeader title='Related Products' subtitle='You might also like' />
              <ProductGrid>
                {relatedProducts.map((p) => (
                  <Product key={p._id} product={p} />
                ))}
              </ProductGrid>
            </section>
          )}

          <ConfirmModal
            show={showDeleteModal}
            title='Delete Product'
            message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
            confirmLabel='Delete'
            isLoading={isDeleting}
            onConfirm={handleDeleteProduct}
            onCancel={() => setShowDeleteModal(false)}
          />
        </>
      )}
    </div>
  );
};

export default ProductScreen;
