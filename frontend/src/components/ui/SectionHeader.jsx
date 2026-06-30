import { Link } from 'react-router-dom';

const SectionHeader = ({ title, subtitle, actionLabel, actionTo }) => (
  <div className='section-header'>
    <div>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {actionLabel && actionTo && (
      <Link to={actionTo} className='btn-outline-custom'>
        {actionLabel}
      </Link>
    )}
  </div>
);

export default SectionHeader;
