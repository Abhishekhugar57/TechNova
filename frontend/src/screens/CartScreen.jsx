import { Link, useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import Message from '../components/Message';
import PageHeader from '../components/ui/PageHeader';
import OrderSummary from '../components/ui/OrderSummary';
import ProductImage from '../components/ProductImage';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import {
  formatPrice,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from '../utils/currencyUtils';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const itemCount = cartItems.reduce((a, i) => a + i.qty, 0);
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  const updateQty = (item, newQty) => {
    if (newQty >= 1 && newQty <= item.countInStock) {
      dispatch(addToCart({ ...item, qty: newQty }));
    }
  };

  return (
    <div className='animate-in'>
      <PageHeader title='Shopping Cart' subtitle={`${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`} />

      {cartItems.length === 0 ? (
        <div className='card-surface card-surface--flat empty-state'>
          <Message>Your cart is empty</Message>
          <Link to='/' className='btn-primary-custom mt-3'>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <Row className='g-4'>
          <Col lg={8}>
            <div className='card-surface card-surface--flat overflow-hidden'>
              {cartItems.map((item) => (
                <div key={item._id} className='cart-item'>
                  <Link to={`/product/${item._id}`}>
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className='cart-item__image'
                      width={120}
                      height={120}
                    />
                  </Link>
                  <div>
                    <Link to={`/product/${item._id}`} className='cart-item__name'>
                      {item.name}
                    </Link>
                    <div className='cart-item__unit-price'>
                      {formatPrice(item.price)} each
                    </div>
                  </div>
                  <div className='d-none d-md-block fw-semibold'>{formatPrice(item.price)}</div>
                  <div>
                    <div className='qty-selector'>
                      <button
                        type='button'
                        onClick={() => updateQty(item, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label='Decrease quantity'
                      >
                        <FaMinus size={10} />
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type='button'
                        onClick={() => updateQty(item, item.qty + 1)}
                        disabled={item.qty >= item.countInStock}
                        aria-label='Increase quantity'
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </div>
                  <div className='fw-bold d-none d-md-block'>
                    {formatPrice(item.qty * item.price)}
                  </div>
                  <button
                    type='button'
                    className='header-icon-btn'
                    onClick={() => dispatch(removeFromCart(item._id))}
                    aria-label='Remove item'
                  >
                    <FaTrash color='var(--color-danger)' size={14} />
                  </button>
                </div>
              ))}
            </div>
          </Col>

          <Col lg={4}>
            <OrderSummary
              rows={[
                [`Items (${itemCount})`, formatPrice(subtotal)],
                ['Shipping', shipping === 0 ? 'Free' : formatPrice(SHIPPING_COST)],
              ]}
              total={['Subtotal', formatPrice(subtotal)]}
              footerLink={
                <Link to='/' className='cart-summary__continue'>
                  Continue Shopping
                </Link>
              }
            >
              <button
                type='button'
                className='btn-primary-custom w-100'
                onClick={() => navigate('/login?redirect=/shipping')}
              >
                Proceed to Checkout
              </button>
            </OrderSummary>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CartScreen;
