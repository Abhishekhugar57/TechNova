import ProductGrid from './ProductGrid';

const ProductGridSkeleton = ({ count = 8 }) => (
  <ProductGrid>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className='product-card product-card--skeleton' aria-hidden='true'>
        <div className='product-card__image-wrap skeleton' />
        <div className='product-card__body'>
          <div className='product-card__top'>
            <div className='skeleton product-card__brand-skeleton' />
            <div className='skeleton product-card__title-skeleton' />
            <div className='skeleton product-card__title-skeleton product-card__title-skeleton--short' />
            <div className='skeleton product-card__rating-skeleton' />
          </div>
          <div className='product-card__footer'>
            <div className='skeleton product-card__price-skeleton' />
            <div className='skeleton product-card__action-skeleton' />
          </div>
        </div>
      </div>
    ))}
  </ProductGrid>
);

export default ProductGridSkeleton;
