import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader';
import ProductDetailSkeleton from '../components/ui/ProductDetailSkeleton';
import PageHeader from '../components/ui/PageHeader';
import OrderSummary from '../components/ui/OrderSummary';
import ProductImage from '../components/ProductImage';
import OrderTrackingTimeline from '../components/OrderTrackingTimeline';
import OrderTrackingProgress from '../components/OrderTrackingProgress';
import OrderTrackingUpdate from '../components/admin/OrderTrackingUpdate';
import TrackingStatusBadge from '../components/TrackingStatusBadge';
import loadRazorpayScript from '../utils/loadRazorpay';
import { isAdminUser } from '../utils/authUtils';
import { formatPrice } from '../utils/currencyUtils';
import { SITE_NAME } from '../constants/site';
import {
  canCancelOrder,
  formatEstimatedDelivery,
  isActiveOrder,
  TERMINAL_STATUSES,
} from '../constants/orderTracking';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetRazorpayKeyIdQuery,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useCancelOrderMutation,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId, {
    pollingInterval: 30000,
    skipPollingIfUnfocused: true,
  });
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: razorpayConfig, isLoading: loadingRazorpayConfig, error: errorRazorpayConfig } = useGetRazorpayKeyIdQuery();

  const isRazorpayConfigured = razorpayConfig?.isConfigured;
  const showRazorpayPayment = !order?.isPaid && order?.paymentMethod === 'Razorpay';

  const handlePayment = async () => {
    setPaymentMessage(null);
    setPaymentLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Failed to load Razorpay. Please try again.');

      const razorpayOrder = await createRazorpayOrder(orderId).unwrap();

      const options = {
        key: razorpayConfig.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: SITE_NAME,
        description: `Order ${order._id}`,
        order_id: razorpayOrder.razorpayOrderId,
        prefill: {
          name: userInfo?.name || order.user.name,
          email: userInfo?.email || order.user.email,
        },
        theme: { color: '#2563eb' },
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({
              orderId,
              paymentDetails: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
            }).unwrap();
            refetch();
            setPaymentMessage({ variant: 'success', text: 'Payment successful! Your order has been paid.' });
            toast.success('Payment successful');
          } catch (err) {
            const message = err?.data?.message || 'Payment verification failed';
            setPaymentMessage({ variant: 'danger', text: message });
            toast.error(message);
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            setPaymentMessage({ variant: 'warning', text: 'Payment cancelled. You can try again when ready.' });
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', (response) => {
        setPaymentLoading(false);
        const message = response.error?.description || 'Payment failed. Please try again.';
        setPaymentMessage({ variant: 'danger', text: message });
        toast.error(message);
      });
      razorpayInstance.open();
    } catch (err) {
      const message = err?.data?.message || err.message || 'Unable to start payment';
      setPaymentMessage({ variant: 'danger', text: message });
      toast.error(message);
      setPaymentLoading(false);
    }
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success('Order marked as delivered');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to mark as delivered');
    }
  };

  const cancelHandler = async (e) => {
    e.preventDefault();
    try {
      await cancelOrder({ orderId, reason: cancelReason }).unwrap();
      setShowCancelForm(false);
      setCancelReason('');
      refetch();
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to cancel order');
    }
  };

  if (isLoading) return <ProductDetailSkeleton />;
  if (error) return <Message variant='danger'>{error.data.message}</Message>;

  const estimatedDelivery = isActiveOrder(order.trackingStatus)
    ? formatEstimatedDelivery(order.createdAt)
    : null;
  const showCustomerCancel =
    !isAdminUser(userInfo) && canCancelOrder(order.trackingStatus);

  return (
    <div className='animate-in'>
      <PageHeader
        title='Order Details'
        subtitle={`#${order._id}`}
        badges={
          <>
            <TrackingStatusBadge status={order.trackingStatus} />
            {order.isPaid ? (
              <span className='badge-pill badge-pill--success'><FaCheck className='me-1' /> Paid</span>
            ) : (
              <span className='badge-pill badge-pill--danger'>Unpaid</span>
            )}
            {order.isDelivered ? (
              <span className='badge-pill badge-pill--success'><FaCheck className='me-1' /> Delivered</span>
            ) : (
              <span className='badge-pill badge-pill--neutral'>Pending Delivery</span>
            )}
          </>
        }
      />

      <Row className='g-4'>
        <Col lg={8}>
          <div className='card-surface card-surface--flat card-surface__body mb-3'>
            <div className='order-tracking-summary'>
              <div className='order-tracking-summary__header'>
                <div>
                  <h5 className='card-surface__title mb-1'>Track Your Order</h5>
                  {estimatedDelivery && (
                    <p className='order-tracking-summary__eta mb-0'>
                      Estimated delivery by <strong>{estimatedDelivery}</strong>
                    </p>
                  )}
                </div>
                {!TERMINAL_STATUSES.includes(order.trackingStatus) && (
                  <span className='order-tracking-summary__live'>Live updates</span>
                )}
              </div>
              <OrderTrackingProgress trackingStatus={order.trackingStatus} />
            </div>
          </div>

          <div className='card-surface card-surface--flat card-surface__body mb-3'>
            <OrderTrackingTimeline
              trackingStatus={order.trackingStatus}
              trackingHistory={order.trackingHistory}
            />
          </div>

          <div className='card-surface card-surface--flat card-surface__body mb-3'>
            <h5 className='card-surface__title'>Shipping Information</h5>
            <p className='mb-1'><strong>{order.user.name}</strong></p>
            <p className='mb-1'><a href={`mailto:${order.user.email}`} className='text-link'>{order.user.email}</a></p>
            <p className='text-muted-custom mb-0'>
              {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </div>

          <div className='card-surface card-surface--flat card-surface__body mb-3'>
            <h5 className='card-surface__title'>Payment</h5>
            <p className='mb-2'>Method: <strong>{order.paymentMethod}</strong></p>
            {order.isPaid ? (
              <Message variant='success'>Paid on {order.paidAt}</Message>
            ) : (
              <Message variant='warning'>Payment pending</Message>
            )}
          </div>

          <div className='card-surface card-surface--flat card-surface__body'>
            <h5 className='card-surface__title'>Order Items</h5>
            {order.orderItems.map((item, index) => (
              <div key={index} className='order-line-item'>
                <ProductImage src={item.image} alt={item.name} className='thumb-image' width={64} height={64} />
                <div className='flex-grow-1'>
                  <Link to={`/product/${item.product}`} className='fw-semibold'>{item.name}</Link>
                  <div className='text-muted-custom' style={{ fontSize: '0.875rem' }}>
                    Qty: {item.qty} &times; {formatPrice(item.price)}
                  </div>
                </div>
                <strong>{formatPrice(item.qty * item.price)}</strong>
              </div>
            ))}
          </div>
        </Col>

        <Col lg={4}>
          <OrderSummary
            rows={[
              ['Items', formatPrice(order.itemsPrice)],
              ['Shipping', formatPrice(order.shippingPrice)],
              ['Tax', formatPrice(order.taxPrice)],
            ]}
            total={['Total', formatPrice(order.totalPrice)]}
          >
            {showRazorpayPayment && (
              <>
                {paymentMessage && <Message variant={paymentMessage.variant}>{paymentMessage.text}</Message>}
                {loadingRazorpayConfig ? (
                  <Loader size='small' />
                ) : errorRazorpayConfig || !isRazorpayConfigured ? (
                  <Message variant='danger'>Razorpay is not configured.</Message>
                ) : (
                  <>
                    <Message variant='info' className='mb-2'>
                      Test: UPI <strong>success@razorpay</strong> or card <strong>4111 1111 1111 1111</strong>
                    </Message>
                    {paymentLoading && <Loader size='small' />}
                    <button type='button' className='btn-primary-custom w-100' disabled={paymentLoading} onClick={handlePayment}>
                      {paymentLoading ? 'Processing...' : 'Pay with Razorpay'}
                    </button>
                  </>
                )}
              </>
            )}

            {loadingDeliver && <Loader size='small' />}
            {isAdminUser(userInfo) && order.isPaid && order.trackingStatus !== 'Delivered' && order.trackingStatus !== 'Cancelled' && (
              <>
                <OrderTrackingUpdate
                  orderId={orderId}
                  currentStatus={order.trackingStatus}
                  onUpdated={refetch}
                />
                {order.trackingStatus === 'Out for Delivery' && (
                  <button type='button' className='btn-outline-custom w-100 mt-3' onClick={deliverHandler} disabled={loadingDeliver}>
                    Quick Mark Delivered
                  </button>
                )}
              </>
            )}

            {showCustomerCancel && (
              <div className='order-cancel-panel'>
                {!showCancelForm ? (
                  <button
                    type='button'
                    className='btn-outline-custom w-100 mt-3 order-cancel-panel__trigger'
                    onClick={() => setShowCancelForm(true)}
                  >
                    Cancel Order
                  </button>
                ) : (
                  <Form onSubmit={cancelHandler} className='order-cancel-panel__form'>
                    <Form.Group className='mb-2'>
                      <Form.Label>Reason for cancellation (optional)</Form.Label>
                      <Form.Control
                        as='textarea'
                        rows={2}
                        className='form-control-modern'
                        placeholder='Tell us why you are cancelling'
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                    </Form.Group>
                    {loadingCancel && <Loader size='small' />}
                    <div className='order-cancel-panel__actions'>
                      <button type='submit' className='btn-accent flex-grow-1' disabled={loadingCancel}>
                        Confirm Cancel
                      </button>
                      <button
                        type='button'
                        className='btn-outline-custom'
                        onClick={() => setShowCancelForm(false)}
                        disabled={loadingCancel}
                      >
                        Keep Order
                      </button>
                    </div>
                  </Form>
                )}
              </div>
            )}
          </OrderSummary>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;
