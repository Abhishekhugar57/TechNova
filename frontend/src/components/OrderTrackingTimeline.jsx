import { FaCheck, FaBox, FaShippingFast, FaTruck, FaHome, FaTimes, FaClipboardList } from 'react-icons/fa';
import { TRACKING_STATUSES, formatTrackingDate } from '../constants/orderTracking';

const STATUS_ICONS = {
  'Order Placed': FaClipboardList,
  'Order Confirmed': FaCheck,
  Packed: FaBox,
  Shipped: FaShippingFast,
  'Out for Delivery': FaTruck,
  Delivered: FaHome,
  Cancelled: FaTimes,
};

const OrderTrackingTimeline = ({ trackingStatus, trackingHistory = [] }) => {
  const isCancelled = trackingStatus === 'Cancelled';
  const currentIndex = TRACKING_STATUSES.indexOf(trackingStatus);

  const historyByStatus = trackingHistory.reduce((acc, entry) => {
    acc[entry.status] = entry;
    return acc;
  }, {});

  const steps = isCancelled
    ? TRACKING_STATUSES.filter((s) => s !== 'Cancelled').slice(0, 1).concat(['Cancelled'])
    : TRACKING_STATUSES.filter((s) => s !== 'Cancelled');

  return (
    <div className='order-tracking'>
      <div className='order-tracking__header'>
        <h5 className='card-surface__title mb-1'>Order Tracking</h5>
        <p className='text-muted-custom mb-0' style={{ fontSize: '0.875rem' }}>
          Current status: <strong>{trackingStatus}</strong>
        </p>
      </div>

      <div className='order-tracking__timeline'>
        {steps.map((status, index) => {
          const entry = historyByStatus[status];
          const stepIndex = TRACKING_STATUSES.indexOf(status);
          const isComplete = isCancelled
            ? status === 'Cancelled' || (status === 'Order Placed' && entry)
            : stepIndex <= currentIndex && entry;
          const isCurrent = status === trackingStatus;
          const isUpcoming = !isComplete && !isCurrent;
          const Icon = STATUS_ICONS[status] || FaCheck;

          return (
            <div
              key={status}
              className={`order-tracking__step ${
                isComplete ? 'order-tracking__step--complete' : ''
              } ${isCurrent ? 'order-tracking__step--current' : ''} ${
                isUpcoming ? 'order-tracking__step--upcoming' : ''
              } ${status === 'Cancelled' ? 'order-tracking__step--cancelled' : ''}`}
            >
              <div className='order-tracking__marker'>
                <span className='order-tracking__icon'>
                  <Icon />
                </span>
                {index < steps.length - 1 && <span className='order-tracking__line' />}
              </div>

              <div className='order-tracking__content'>
                <div className='order-tracking__status-row'>
                  <strong className='order-tracking__status'>{status}</strong>
                  {isCurrent && <span className='order-tracking__current-badge'>Current</span>}
                </div>

                {entry ? (
                  <>
                    <p className='order-tracking__description'>{entry.description}</p>
                    <div className='order-tracking__meta'>
                      {entry.location && (
                        <span className='order-tracking__location'>{entry.location}</span>
                      )}
                      {entry.updatedAt && (
                        <span className='order-tracking__date'>
                          {formatTrackingDate(entry.updatedAt)}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className='order-tracking__description order-tracking__description--pending'>
                    {isUpcoming ? 'Pending' : 'Awaiting update'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTrackingTimeline;
