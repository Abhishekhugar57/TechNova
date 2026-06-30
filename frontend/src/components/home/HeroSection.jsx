import { Link } from 'react-router-dom';

const HeroSection = () => (
  <section className='hero-section animate-in'>
    <div className='hero-section__content'>
      <span className='hero-section__eyebrow'>New Season Collection</span>
      <h1>Elevate Your Everyday Style</h1>
      <p>
        Discover premium electronics and essentials curated for modern living.
        Quality you can trust, delivered to your door.
      </p>
      <div className='hero-section__actions'>
        <Link to='/#products' className='btn-primary-custom'>
          Shop Now
        </Link>
        <Link to='/page/1' className='btn-outline-custom'>
          Browse All
        </Link>
      </div>
    </div>
  </section>
);

export default HeroSection;
