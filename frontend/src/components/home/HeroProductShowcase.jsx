import { useMemo } from 'react';
import HeroProductCard from './HeroProductCard';
import { useHeroProductRotation } from '../../hooks/useHeroProductRotation';
import { filterHeroProducts } from '../../utils/heroProductUtils';

const ROTATION_INTERVAL = 2500;

const HeroProductShowcaseSkeleton = () => (
  <div className='hero-showcase hero-showcase--loading' aria-hidden='true'>
    <div className='hero-showcase__glow' />
    <div className='hero-showcase__stage'>
      <div className='hero-showcase__carousel'>
        <div className='hero-product-card hero-product-card--featured hero-product-card--skeleton' />
      </div>
    </div>
  </div>
);

const HeroProductShowcase = ({ products, isLoading }) => {
  const productList = useMemo(() => filterHeroProducts(products), [products]);
  const productIds = useMemo(
    () => productList.map((product) => product._id).join(','),
    [productList]
  );
  const { activeIndex, exitIndex, goTo, pause, resume } = useHeroProductRotation(
    productList.length,
    ROTATION_INTERVAL,
    productIds
  );

  if (isLoading) {
    return <HeroProductShowcaseSkeleton />;
  }

  if (!productList.length) {
    return (
      <div className='hero-showcase hero-showcase--empty' aria-hidden='true'>
        <div className='hero-showcase__glow' />
        <div className='hero-showcase__ring' />
      </div>
    );
  }

  const activeProduct = productList[activeIndex];

  return (
    <div
      className='hero-showcase'
      aria-roledescription='carousel'
      aria-label='Featured products'
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div className='hero-showcase__glow' aria-hidden='true' />
      <div className='hero-showcase__ring' aria-hidden='true' />
      <div className='hero-showcase__stage'>
        <div className='hero-showcase__carousel' aria-live='polite'>
          {productList.map((product, index) => {
            const isActive = index === activeIndex;
            const isExiting = index === exitIndex;
            const slideClass = [
              'hero-showcase__slide',
              isActive && 'hero-showcase__slide--active',
              isExiting && 'hero-showcase__slide--exit',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={product._id}
                className={slideClass}
                aria-hidden={!isActive}
              >
                <HeroProductCard
                  product={product}
                  priority={index === 0}
                  isInteractive={isActive}
                />
              </div>
            );
          })}
        </div>

        {productList.length > 1 ? (
          <div className='hero-showcase__controls'>
            <p className='hero-showcase__status visually-hidden'>
              Showing {activeIndex + 1} of {productList.length}: {activeProduct.name}
            </p>
            <div
              className='hero-showcase__dots'
              role='tablist'
              aria-label='Featured product slides'
            >
              {productList.map((product, index) => (
                <button
                  key={product._id}
                  type='button'
                  role='tab'
                  className={`hero-showcase__dot${
                    index === activeIndex ? ' hero-showcase__dot--active' : ''
                  }`}
                  aria-label={`Show ${product.name}`}
                  aria-selected={index === activeIndex}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HeroProductShowcase;
