import { Link } from 'react-router-dom';
import ProductImage from '../../ProductImage';

const LowStockWidget = ({ products }) => (
  <div className='dash-card'>
    <div className='dash-card__header'>
      <h3 className='dash-card__title'>Low Stock Alert</h3>
      <Link to='/admin/productlist' className='dash-card__link'>Manage</Link>
    </div>
    <div className='dash-card__body dash-card__body--flush'>
      {products.length === 0 ? (
        <p className='dash-empty'>All products are well stocked</p>
      ) : (
        products.map((product) => (
          <Link
            key={product._id}
            to={`/admin/product/${product._id}/edit`}
            className='dash-list-item'
            style={{ textDecoration: 'none' }}
          >
            <ProductImage src={product.image} alt={product.name} className='dash-list-item__thumb' width={48} height={48} />
            <div className='dash-list-item__content'>
              <div className='dash-list-item__title'>{product.name}</div>
              <div className='dash-list-item__meta'>{product.brand} · {product.category}</div>
            </div>
            <span
              className={`dash-badge ${
                product.countInStock === 0
                  ? 'dash-badge--danger'
                  : 'dash-badge--warning'
              }`}
            >
              {product.countInStock} left
            </span>
          </Link>
        ))
      )}
    </div>
  </div>
);

export default LowStockWidget;
