import { getTrackingStatusVariant } from '../constants/orderTracking';

const TrackingStatusBadge = ({ status }) => {
  if (!status) return null;

  const variant = getTrackingStatusVariant(status);

  return (
    <span className={`badge-pill badge-pill--${variant}`} style={{ whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
};

export default TrackingStatusBadge;
