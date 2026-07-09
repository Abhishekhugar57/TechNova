import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import PageHeader from '../components/ui/PageHeader';
import OrderSummary from '../components/ui/OrderSummary';
import ProductImage from '../components/ProductImage';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { formatPrice } from '../utils/currencyUtils';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) navigate('/shipping');
    else if (!cart.paymentMethod) navigate('/payment');
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='animate-in'>
      <Link to='/payment' className='btn-outline-custom page-back-link'>
        &larr; Back to Payment
      </Link>
      <CheckoutSteps step1 step2 step3 step4 />
      <PageHeader title='Review & Place Order' subtitle='Confirm your order details before placing' />

      <Row className='g-4'>
        <Col lg={8}>
          <div className='card-surface card-surface--flat card-surface__body mb-3'>
            <h5 className='card-surface__title'>Shipping</h5>
            <p className='text-muted-custom mb-0'>
              {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>
          <div className='card-surface card-surface--flat card-surface__body mb-3'>
            <h5 className='card-surface__title'>Payment</h5>
            <p className='mb-0'>{cart.paymentMethod}</p>
          </div>
          <div className='card-surface card-surface--flat card-surface__body'>
            <h5 className='card-surface__title'>Order Items</h5>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              cart.cartItems.map((item) => (
                <div key={item._id} className='order-line-item'>
                  <ProductImage src={item.image} alt={item.name} className='thumb-image thumb-image--sm' width={56} height={56} />
                  <div className='flex-grow-1'>
                    <Link to={`/product/${item.product}`} className='fw-semibold'>
                      {item.name}
                    </Link>
                    <div className='text-muted-custom' style={{ fontSize: '0.875rem' }}>
                      {item.qty} x {formatPrice(item.price)}
                    </div>
                  </div>
                  <strong>{formatPrice(item.qty * item.price)}</strong>
                </div>
              ))
            )}
          </div>
        </Col>

        <Col lg={4}>
          <OrderSummary
            rows={[
              ['Items', formatPrice(cart.itemsPrice)],
              ['Shipping', formatPrice(cart.shippingPrice)],
              ['Tax', formatPrice(cart.taxPrice)],
            ]}
            total={['Total', formatPrice(cart.totalPrice)]}
          >
            {error && <Message variant='danger'>{error.data.message}</Message>}
            <button
              type='button'
              className='btn-primary-custom w-100'
              disabled={cart.cartItems.length === 0 || isLoading}
              onClick={placeOrderHandler}
            >
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </button>
            {isLoading && <Loader size='small' />}
          </OrderSummary>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
