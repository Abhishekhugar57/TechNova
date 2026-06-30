import { FaShoppingBag, FaCreditCard, FaTruck } from 'react-icons/fa';

const iconMap = {
  order: FaShoppingBag,
  payment: FaCreditCard,
  delivery: FaTruck,
};

const classMap = {
  order: 'dash-list-item__icon--order',
  payment: 'dash-list-item__icon--payment',
  delivery: 'dash-list-item__icon--delivery',
};

const RecentActivityWidget = ({ activities }) => (
  <div className='dash-card'>
    <div className='dash-card__header'>
      <h3 className='dash-card__title'>Recent Activity</h3>
    </div>
    <div className='dash-card__body dash-card__body--flush'>
      {activities.length === 0 ? (
        <p className='dash-empty'>No recent activity</p>
      ) : (
        activities.map((activity) => {
          const Icon = iconMap[activity.type] || FaShoppingBag;
          return (
            <div key={activity.id} className='dash-list-item'>
              <div className={`dash-list-item__icon ${classMap[activity.type]}`}>
                <Icon />
              </div>
              <div className='dash-list-item__content'>
                <div className='dash-list-item__title'>{activity.message}</div>
                <div className='dash-list-item__meta'>
                  {new Date(activity.date).toLocaleString()} · {activity.meta}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);

export default RecentActivityWidget;
