import { Link } from 'react-router-dom';
import TrackingStatusBadge from '../../TrackingStatusBadge';
import { formatPrice } from '../../../utils/currencyUtils';

const RecentOrdersWidget = ({ orders }) => (
  <div className='dash-card'>
    <div className='dash-card__header'>
      <h3 className='dash-card__title'>Recent Orders</h3>
      <Link to='/admin/orderlist' className='dash-card__link'>View all</Link>
    </div>
    <div className='dash-card__body dash-card__body--flush'>
      {orders.length === 0 ? (
        <p className='dash-empty'>No orders yet</p>
      ) : (
        orders.map((order) => (
          <Link
            key={order._id}
            to={`/order/${order._id}`}
            className='dash-list-item'
            style={{ textDecoration: 'none' }}
          >
            <div className='dash-list-item__content'>
              <div className='dash-list-item__title'>
                {order.user?.name || 'Customer'}
              </div>
              <div className='dash-list-item__meta'>
                {new Date(order.createdAt).toLocaleDateString()} · #{order._id.slice(-6)}
              </div>
              <div className='mt-1'>
                <TrackingStatusBadge status={order.trackingStatus} />
              </div>
            </div>
            <span
              className={`dash-badge ${
                order.isPaid ? 'dash-badge--success' : 'dash-badge--warning'
              }`}
            >
              {order.isPaid ? 'Paid' : 'Pending'}
            </span>
            <span className='dash-list-item__value'>{formatPrice(order.totalPrice)}</span>
          </Link>
        ))
      )}
    </div>
  </div>
);

export default RecentOrdersWidget;
