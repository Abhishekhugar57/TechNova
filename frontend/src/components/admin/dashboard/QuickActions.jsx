import { Link } from 'react-router-dom';
import { FaBox, FaShoppingBag, FaUsers, FaPlus } from 'react-icons/fa';

const actions = [
  { to: '/admin/product/create', label: 'Add Product', icon: FaPlus, color: '#2563eb' },
  { to: '/admin/productlist', label: 'Products', icon: FaBox, color: '#0891b2' },
  { to: '/admin/orderlist', label: 'Orders', icon: FaShoppingBag, color: '#7c3aed' },
  { to: '/admin/userlist', label: 'Users', icon: FaUsers, color: '#059669' },
];

const QuickActions = () => (
  <div className='dash-card'>
    <div className='dash-card__header'>
      <h3 className='dash-card__title'>Quick Actions</h3>
    </div>
    <div className='dash-card__body'>
      <div className='dash-actions'>
        {actions.map(({ to, label, icon: Icon, color }) => (
          <Link key={to} to={to} className='dash-action'>
            <span className='dash-action__icon' style={{ background: `${color}18`, color }}>
              <Icon />
            </span>
            <span className='dash-action__label'>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default QuickActions;
