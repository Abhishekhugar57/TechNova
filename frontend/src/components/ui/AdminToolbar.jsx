import { FaSearch } from 'react-icons/fa';

const AdminToolbar = ({
  title,
  placeholder,
  value,
  onChange,
  count,
  countLabel = 'items',
}) => (
  <div className='admin-table-toolbar'>
  {title ? (
      <h5 className='admin-table-toolbar__title'>{title}</h5>
    ) : placeholder ? (
      <div className='search-field'>
        <FaSearch className='search-field__icon' />
        <input
          type='search'
          className='form-control form-control-modern'
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    ) : (
      <span />
    )}
    {count !== undefined && (
      <span className='admin-table-toolbar__count'>
        {count} {countLabel}
      </span>
    )}
  </div>
);

export default AdminToolbar;
