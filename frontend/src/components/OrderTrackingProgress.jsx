import { FULFILLMENT_STATUSES } from '../constants/orderTracking';

const OrderTrackingProgress = ({ trackingStatus, compact = false }) => {
  const isCancelled = trackingStatus === 'Cancelled';
  const currentIndex = FULFILLMENT_STATUSES.indexOf(trackingStatus);

  if (isCancelled) {
    return (
      <div className='order-progress order-progress--cancelled'>
        <div className='order-progress__bar'>
          <div className='order-progress__fill order-progress__fill--cancelled' style={{ width: '100%' }} />
        </div>
        <p className='order-progress__label order-progress__label--cancelled'>Order Cancelled</p>
      </div>
    );
  }

  const progress =
    currentIndex >= 0
      ? Math.round((currentIndex / (FULFILLMENT_STATUSES.length - 1)) * 100)
      : 0;

  return (
    <div className={`order-progress ${compact ? 'order-progress--compact' : ''}`}>
      <div className='order-progress__bar' role='progressbar' aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className='order-progress__fill' style={{ width: `${progress}%` }} />
      </div>

      {!compact && (
        <div className='order-progress__steps'>
          {FULFILLMENT_STATUSES.map((status, index) => {
            const isComplete = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={status}
                className={`order-progress__step ${
                  isComplete ? 'order-progress__step--complete' : ''
                } ${isCurrent ? 'order-progress__step--current' : ''}`}
              >
                <span className='order-progress__dot' />
                <span className='order-progress__step-label'>{status}</span>
              </div>
            );
          })}
        </div>
      )}

      {compact && (
        <p className='order-progress__label'>
          Step {Math.max(currentIndex + 1, 1)} of {FULFILLMENT_STATUSES.length}
          {' · '}
          <strong>{trackingStatus}</strong>
        </p>
      )}
    </div>
  );
};

export default OrderTrackingProgress;
