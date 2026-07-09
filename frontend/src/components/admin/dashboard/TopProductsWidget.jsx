import { Link } from 'react-router-dom';
import ProductImage from '../../ProductImage';
import { formatPrice } from '../../../utils/currencyUtils';

const TopProductsWidget = ({ products }) => (
  <div className='dash-card'>
    <div className='dash-card__header'>
      <h3 className='dash-card__title'>Top Selling Products</h3>
      <Link to='/admin/productlist' className='dash-card__link'>View all</Link>
    </div>
    <div className='dash-card__body dash-card__body--flush'>
      {products.length === 0 ? (
        <p className='dash-empty'>No sales data yet</p>
      ) : (
        products.map((product, index) => (
          <div key={product.name} className='dash-list-item'>
            <ProductImage src={product.image} alt={product.name} className='dash-list-item__thumb' width={48} height={48} />
            <div className='dash-list-item__content'>
              <div className='dash-list-item__title'>{product.name}</div>
              <div className='dash-list-item__meta'>{product.qty} units sold</div>
            </div>
            <span className='dash-list-item__value'>{formatPrice(product.revenue)}</span>
          </div>
        ))
      )}
    </div>
  </div>
);

export default TopProductsWidget;
