import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import PageHeader from '../components/ui/PageHeader';
import OrderHistoryCard from '../components/OrderHistoryCard';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { isActiveOrder } from '../constants/orderTracking';
import { setCredentials } from '../slices/authSlice';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orderFilter, setOrderFilter] = useState('active');
  const { userInfo } = useSelector((state) => state.auth);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery(undefined, {
    pollingInterval: 60000,
    skipPollingIfUnfocused: true,
  });
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.name]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const res = await updateProfile({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const activeOrders = orders?.filter((order) => isActiveOrder(order.trackingStatus)) || [];
  const pastOrders = orders?.filter((order) => !isActiveOrder(order.trackingStatus)) || [];
  const displayedOrders = orderFilter === 'active' ? activeOrders : pastOrders;

  return (
    <div className='animate-in'>
      <PageHeader title='My Account' subtitle='Manage your profile and track your orders' />

      <div className='row g-4'>
        <div className='col-lg-4'>
          <div className='card-surface card-surface--flat card-surface__body'>
            <h5 className='card-surface__title'>Profile Settings</h5>
            <Form onSubmit={submitHandler}>
              {[
                { label: 'Name', type: 'text', value: name, setter: setName },
                { label: 'Email', type: 'email', value: email, setter: setEmail },
                { label: 'New Password', type: 'password', value: password, setter: setPassword },
                { label: 'Confirm Password', type: 'password', value: confirmPassword, setter: setConfirmPassword },
              ].map(({ label, type, value, setter }) => (
                <Form.Group key={label} className='mb-3'>
                  <Form.Label>{label}</Form.Label>
                  <Form.Control type={type} className='form-control-modern' value={value} onChange={(e) => setter(e.target.value)} />
                </Form.Group>
              ))}
              <button type='submit' className='btn-primary-custom w-100' disabled={loadingUpdateProfile}>
                Update Profile
              </button>
              {loadingUpdateProfile && <Loader size='small' />}
            </Form>
          </div>
        </div>

        <div className='col-lg-8'>
          <div className='order-history-section'>
            <div className='order-history-section__header'>
              <div>
                <h5 className='card-surface__title mb-1'>My Orders</h5>
                <p className='text-muted-custom mb-0' style={{ fontSize: '0.875rem' }}>
                  {orders?.length || 0} total order{orders?.length === 1 ? '' : 's'}
                </p>
              </div>
              <div className='order-history-section__tabs' role='tablist'>
                <button
                  type='button'
                  role='tab'
                  className={`order-history-section__tab ${orderFilter === 'active' ? 'order-history-section__tab--active' : ''}`}
                  onClick={() => setOrderFilter('active')}
                >
                  Active ({activeOrders.length})
                </button>
                <button
                  type='button'
                  role='tab'
                  className={`order-history-section__tab ${orderFilter === 'past' ? 'order-history-section__tab--active' : ''}`}
                  onClick={() => setOrderFilter('past')}
                >
                  Past ({pastOrders.length})
                </button>
              </div>
            </div>

            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>{error?.data?.message || error.error}</Message>
            ) : displayedOrders.length === 0 ? (
              <div className='card-surface card-surface--flat card-surface__body text-center'>
                <p className='text-muted-custom mb-3'>
                  {orderFilter === 'active'
                    ? 'No active orders right now.'
                    : 'No past orders yet.'}
                </p>
                <Link to='/' className='btn-primary-custom'>
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className='order-history-list'>
                {displayedOrders.map((order) => (
                  <OrderHistoryCard key={order._id} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
