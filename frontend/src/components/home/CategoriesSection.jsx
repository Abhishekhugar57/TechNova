import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import { useGetProductCategoriesQuery } from '../../slices/productsApiSlice';
import { CATEGORY_META, categoryToSlug } from '../../constants/productCategories';

const CategoriesSection = () => {
  const { data: categories, isLoading, error } = useGetProductCategoriesQuery();

  const sortedCategories = categories
    ? [...categories]
        .filter(({ name }) => CATEGORY_META[name])
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  return (
    <section className='page-section page-container'>
      <SectionHeader
        title='Shop by Category'
        subtitle='Browse electronics by type'
      />
      {isLoading ? (
        <Row className='g-3'>
          {[...Array(6).keys()].map((i) => (
            <Col key={i} xs={6} md={4} lg={2}>
              <div className='category-card category-card--skeleton' aria-hidden='true' />
            </Col>
          ))}
        </Row>
      ) : error ? null : (
        <Row className='g-3'>
          {sortedCategories.map(({ name, count }) => {
            const Icon = CATEGORY_META[name]?.icon;
            const slug = categoryToSlug(name);

            return (
              <Col key={name} xs={6} md={4} lg={2}>
                <Link to={`/category/${slug}`} className='category-card'>
                  <div className='category-card__icon'>
                    {Icon ? <Icon /> : null}
                  </div>
                  <span className='category-card__name'>{name}</span>
                  <span className='category-card__count'>{count} items</span>
                </Link>
              </Col>
            );
          })}
        </Row>
      )}
    </section>
  );
};

export default CategoriesSection;
