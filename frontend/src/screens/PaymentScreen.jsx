import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import PageHeader from '../components/ui/PageHeader';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const [paymentMethod, setPaymentMethod] = useState(cart.paymentMethod || 'Razorpay');
  const dispatch = useDispatch();

  useEffect(() => {
    if (!shippingAddress.address) navigate('/shipping');
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className='animate-in checkout-layout'>
      <Link to='/shipping' className='btn-outline-custom page-back-link'>
        &larr; Back to Shipping
      </Link>
      <CheckoutSteps step1 step2 step3 />
      <PageHeader title='Payment Method' subtitle='Choose how you would like to pay' />
      <div className='card-surface card-surface--flat card-surface__body'>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as='legend' className='fw-semibold mb-3'>Select Method</Form.Label>
            <div
              className={`selectable-card mb-3 ${paymentMethod === 'Razorpay' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('Razorpay')}
              role='button'
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setPaymentMethod('Razorpay')}
            >
              <Form.Check
                type='radio'
                label='Razorpay (Cards, UPI, Netbanking & more)'
                id='Razorpay'
                name='paymentMethod'
                value='Razorpay'
                checked={paymentMethod === 'Razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>
          </Form.Group>
          <button type='submit' className='btn-primary-custom w-100'>Continue</button>
        </Form>
      </div>
    </div>
  );
};

export default PaymentScreen;
