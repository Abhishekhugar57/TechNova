const PageHeader = ({
  title,
  subtitle,
  children,
  badges,
  className = '',
}) => (
  <div className={`page-header ${badges || children ? 'page-header--flex' : ''} ${className}`}>
    <div>
      <h1 className='page-title'>{title}</h1>
      {subtitle && <p className='page-subtitle'>{subtitle}</p>}
    </div>
    {badges && <div className='page-header__badges'>{badges}</div>}
    {children}
  </div>
);

export default PageHeader;
