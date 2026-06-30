import { Helmet } from 'react-helmet-async';
import { SITE_NAME } from '../constants/site';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: `${SITE_NAME} | Premium Electronics Store`,
  description:
    'Shop premium electronics at TechNova. Curated smartphones, laptops, audio gear, and accessories with secure checkout and fast delivery.',
  keywords:
    'technova, electronics, ecommerce, smartphones, laptops, headphones, online shopping',
};

export default Meta;
