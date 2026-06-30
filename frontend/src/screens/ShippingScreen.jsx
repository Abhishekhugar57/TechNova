import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import PageHeader from '../components/ui/PageHeader';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  const fields = [
    { id: 'address', label: 'Address', value: address, setter: setAddress },
    { id: 'city', label: 'City', value: city, setter: setCity },
    { id: 'postalCode', label: 'Postal Code', value: postalCode, setter: setPostalCode },
    { id: 'country', label: 'Country', value: country, setter: setCountry },
  ];

  return (
    <div className='animate-in checkout-layout'>
      <Link to='/cart' className='btn-outline-custom page-back-link'>
        &larr; Back to Cart
      </Link>
      <CheckoutSteps step1 step2 />
      <PageHeader title='Shipping Address' subtitle='Where should we deliver your order?' />
      <div className='card-surface card-surface--flat card-surface__body'>
        <Form onSubmit={submitHandler}>
          {fields.map(({ id, label, value, setter }) => (
            <Form.Group key={id} className='mb-3'>
              <Form.Label>{label}</Form.Label>
              <Form.Control
                type='text'
                className='form-control-modern'
                value={value}
                required
                onChange={(e) => setter(e.target.value)}
              />
            </Form.Group>
          ))}
          <button type='submit' className='btn-primary-custom w-100'>
            Continue to Payment
          </button>
        </Form>
      </div>
    </div>
  );
};

export default ShippingScreen;
