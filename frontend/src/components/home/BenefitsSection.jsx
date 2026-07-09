import { Row, Col } from 'react-bootstrap';
import { FaShippingFast, FaShieldAlt, FaUndo, FaHeadset } from 'react-icons/fa';

import { formatPrice, FREE_SHIPPING_THRESHOLD } from '../../utils/currencyUtils';

const benefits = [
  {
    icon: FaShippingFast,
    title: 'Free Shipping',
    text: `On orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`,
  },
  { icon: FaShieldAlt, title: 'Secure Payment', text: '100% protected checkout' },
  { icon: FaUndo, title: 'Easy Returns', text: '30-day return policy' },
  { icon: FaHeadset, title: '24/7 Support', text: 'Dedicated customer care' },
];

const BenefitsSection = () => (
  <section className='page-section page-container'>
    <div className='card-surface card-surface--flat card-surface__body'>
      <Row className='g-4'>
        {benefits.map(({ icon: Icon, title, text }) => (
          <Col key={title} xs={6} lg={3}>
            <div className='benefit-card'>
              <div className='benefit-card__icon'>
                <Icon />
              </div>
              <h6 className='fw-bold mb-1'>{title}</h6>
              <p className='text-muted-custom mb-0' style={{ fontSize: '0.875rem' }}>
                {text}
              </p>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  </section>
);

export default BenefitsSection;
