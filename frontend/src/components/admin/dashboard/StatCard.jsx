import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const StatCard = ({ label, value, sub, growth, growthLabel, icon: Icon, variant = 'revenue' }) => {
  const growthNum = Number(growth);
  const growthClass =
    growthNum > 0 ? 'up' : growthNum < 0 ? 'down' : 'neutral';

  return (
    <article className={`dash-stat dash-stat--${variant}`}>
      <div className='dash-stat__top'>
        <div className={`dash-stat__icon`}>
          <Icon />
        </div>
        {growth !== undefined && (
          <span className={`dash-stat__growth dash-stat__growth--${growthClass}`}>
            {growthNum > 0 ? <FaArrowUp size={10} /> : growthNum < 0 ? <FaArrowDown size={10} /> : null}
            {Math.abs(growthNum)}%
          </span>
        )}
      </div>
      <div className='dash-stat__label'>{label}</div>
      <div className='dash-stat__value'>{value}</div>
      <div className='dash-stat__sub'>{growthLabel || sub}</div>
    </article>
  );
};

export default StatCard;
