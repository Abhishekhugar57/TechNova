import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import TrackingStatusBadge from './TrackingStatusBadge';
import OrderTrackingProgress from './OrderTrackingProgress';
import {
  formatTrackingDateShort,
  formatEstimatedDelivery,
  isActiveOrder,
  getTrackingProgress,
} from '../constants/orderTracking';
import { formatPrice } from '../utils/currencyUtils';

const OrderHistoryCard = ({ order }) => {
  const firstItem = order.orderItems?.[0];
  const itemCount = order.orderItems?.reduce((sum, item) => sum + item.qty, 0) || 0;
  const extraItems = (order.orderItems?.length || 0) - 1;
  const active = isActiveOrder(order.trackingStatus);
  const eta = active ? formatEstimatedDelivery(order.createdAt) : null;

  return (
    <article className='order-history-card'>
      <div className='order-history-card__header'>
        <div>
          <p className='order-history-card__id'>Order #{order._id.slice(-8).toUpperCase()}</p>
          <p className='order-history-card__date'>
            Placed on {formatTrackingDateShort(order.createdAt)}
          </p>
        </div>
        <TrackingStatusBadge status={order.trackingStatus} />
      </div>

      <div className='order-history-card__body'>
        {firstItem && (
          <div className='order-history-card__product'>
            <div className='order-history-card__thumb'>
              <ProductImage
                src={firstItem.image}
                alt={firstItem.name}
                width={72}
                height={72}
              />
            </div>
            <div className='order-history-card__details'>
              <p className='order-history-card__name'>{firstItem.name}</p>
              <p className='order-history-card__meta'>
                {itemCount} item{itemCount === 1 ? '' : 's'}
                {extraItems > 0 && ` · +${extraItems} more product${extraItems === 1 ? '' : 's'}`}
              </p>
              <p className='order-history-card__total'>{formatPrice(order.totalPrice)}</p>
            </div>
          </div>
        )}

        <OrderTrackingProgress trackingStatus={order.trackingStatus} compact />

        {eta && (
          <p className='order-history-card__eta'>
            Estimated delivery by <strong>{eta}</strong>
          </p>
        )}
      </div>

      <div className='order-history-card__footer'>
        <div className='order-history-card__progress-text'>
          {active ? (
            <span>{getTrackingProgress(order.trackingStatus)}% complete</span>
          ) : order.trackingStatus === 'Delivered' ? (
            <span className='text-success'>Delivered successfully</span>
          ) : (
            <span>Order cancelled</span>
          )}
        </div>
        <Link to={`/order/${order._id}`} className='btn-outline-custom btn-sm-custom'>
          {active ? 'Track Order' : 'View Details'}
        </Link>
      </div>
    </article>
  );
};

export default OrderHistoryCard;
