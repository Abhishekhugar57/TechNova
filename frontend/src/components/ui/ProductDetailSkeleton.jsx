import { Row, Col } from 'react-bootstrap';

const ProductDetailSkeleton = () => (
  <div className='animate-in'>
    <div className='skeleton mb-4' style={{ height: 36, width: 140, borderRadius: 999 }} />
    <Row className='g-4'>
      <Col lg={6}>
        <div className='skeleton' style={{ aspectRatio: '1', borderRadius: 16 }} />
        <div className='d-flex gap-2 mt-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='skeleton' style={{ width: 72, height: 72, borderRadius: 8 }} />
          ))}
        </div>
      </Col>
      <Col lg={6}>
        <div className='skeleton mb-3' style={{ height: 24, width: 80, borderRadius: 999 }} />
        <div className='skeleton mb-3' style={{ height: 36, width: '80%' }} />
        <div className='skeleton mb-3' style={{ height: 20, width: 120 }} />
        <div className='skeleton mb-3' style={{ height: 40, width: 100 }} />
        <div className='skeleton mb-4' style={{ height: 80, width: '100%' }} />
        <div className='skeleton' style={{ height: 120, borderRadius: 16 }} />
      </Col>
    </Row>
  </div>
);

export default ProductDetailSkeleton;
