import { Link } from 'react-router-dom';

const PromoBanner = () => (
  <section className='page-section page-container'>
    <div className='promo-banner animate-in'>
      <div className='promo-banner__content'>
        <p className='hero-section__eyebrow' style={{ marginBottom: 8 }}>
          Limited Time Offer
        </p>
        <h3>Up to 30% Off Select Items</h3>
        <p>Upgrade your setup with our best-selling tech picks.</p>
      </div>
      <Link to='/category/smartphones' className='btn-primary-custom'>
        Shop Deals
      </Link>
    </div>
  </section>
);

export default PromoBanner;
