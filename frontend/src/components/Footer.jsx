import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SITE_NAME } from '../constants/site';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='site-footer'>
      <div className='page-container'>
        <Row className='g-4 mb-5'>
          <Col xs={12} md={4}>
            <h5>{SITE_NAME}</h5>
            <p className='site-footer__desc'>
              Premium e-commerce experience with curated products, secure
              checkout, and fast delivery.
            </p>
          </Col>
          <Col xs={6} md={2}>
            <h5>Shop</h5>
            <Link to='/'>All Products</Link>
            <Link to='/category/smartphones'>Smartphones</Link>
            <Link to='/category/laptops'>Laptops</Link>
            <Link to='/category/headphones-earbuds'>Audio</Link>
            <Link to='/cart'>Cart</Link>
          </Col>
          <Col xs={6} md={2}>
            <h5>Account</h5>
            <Link to='/login'>Sign In</Link>
            <Link to='/register'>Register</Link>
            <Link to='/profile'>My Profile</Link>
            <Link to='/profile'>Order History</Link>
          </Col>
          <Col xs={6} md={2}>
            <h5>Support</h5>
            <a href='#help'>Help Center</a>
            <a href='#shipping'>Shipping Info</a>
            <a href='#returns'>Returns</a>
            <a href='#contact'>Contact Us</a>
          </Col>
          <Col xs={6} md={2}>
            <h5>Company</h5>
            <a href='#about'>About Us</a>
            <a href='#careers'>Careers</a>
            <a href='#privacy'>Privacy Policy</a>
            <a href='#terms'>Terms of Service</a>
          </Col>
        </Row>
        <div className='site-footer__bottom'>
          &copy; {currentYear} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
