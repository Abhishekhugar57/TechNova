import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaShippingFast,
  FaShieldAlt,
  FaUndo,
  FaAward,
} from 'react-icons/fa';
import { useGetTopProductsQuery } from '../../slices/productsApiSlice';
import HeroProductShowcase from './HeroProductShowcase';

const trustItems = [
  { icon: FaShippingFast, label: 'Free Shipping' },
  { icon: FaShieldAlt, label: 'Secure Payments' },
  { icon: FaUndo, label: 'Easy Returns' },
  { icon: FaAward, label: 'Genuine Products' },
];

const HeroSection = () => {
  const { data: topProducts, isLoading } = useGetTopProductsQuery();

  return (
    <div className='hero-wrapper'>
      <section className='hero-section animate-in' aria-labelledby='hero-heading'>
        <div className='hero-section__glow' aria-hidden='true' />
        <div className='hero-section__inner page-container'>
          <div className='hero-section__content'>
            <span className='hero-section__badge hero-section__badge--sale'>
              ⚡ Monsoon Sale | Up to 40% OFF
            </span>
            <h1 id='hero-heading'>Upgrade Your Tech with Premium Electronics</h1>
            <p>
              Discover the latest smartphones, laptops, smartwatches, headphones, and
              gaming accessories — handpicked from our highest-rated collection with
              fast delivery across India.
            </p>
            <div className='hero-section__actions'>
              <Link to='/#products' className='btn-primary-custom hero-section__btn-primary'>
                Shop Now
                <FaArrowRight className='hero-section__btn-arrow' aria-hidden='true' />
              </Link>
              <Link to='/#featured' className='btn-outline-custom'>
                View Deals
              </Link>
            </div>
            <ul className='hero-trust' aria-label='Store trust indicators'>
              {trustItems.map(({ icon: Icon, label }) => (
                <li key={label} className='hero-trust__item'>
                  <Icon className='hero-trust__icon' aria-hidden='true' />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <HeroProductShowcase products={topProducts} isLoading={isLoading} />
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
