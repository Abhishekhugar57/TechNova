import { lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetProductsQuery, useGetTopProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import HeroSection from '../components/home/HeroSection';
import CategoriesSection from '../components/home/CategoriesSection';
import PromoBanner from '../components/home/PromoBanner';
import SectionHeader from '../components/ui/SectionHeader';
import ProductGrid from '../components/ui/ProductGrid';
import ProductGridSkeleton from '../components/ui/ProductGridSkeleton';
import { isAdminUser } from '../utils/authUtils';
import { slugToCategory } from '../constants/productCategories';

const BenefitsSection = lazy(() => import('../components/home/BenefitsSection'));
const NewsletterSection = lazy(() => import('../components/home/NewsletterSection'));

const HomeScreen = () => {
  const { pageNumber, keyword, categorySlug } = useParams();
  const category = categorySlug ? slugToCategory(categorySlug) : undefined;
  const { userInfo } = useSelector((state) => state.auth);
  const isSearch = Boolean(keyword);
  const isCategory = Boolean(category);
  const isFiltered = isSearch || isCategory;
  const isHome = !isFiltered && !pageNumber;

  const { data, isLoading, error } = useGetProductsQuery(
    { keyword, pageNumber, category },
    { skip: Boolean(categorySlug && !category) }
  );

  const { data: topProducts, isLoading: loadingTop } = useGetTopProductsQuery(undefined, {
    skip: isFiltered,
  });

  const productCount = data?.total ?? data?.products?.length ?? 0;

  return (
    <>
      {isHome && !isAdminUser(userInfo) && <HeroSection />}

      {isFiltered && (
        <div className='page-container page-section'>
          <Link to='/' className='btn-outline-custom page-back-link'>
            &larr; Back to Home
          </Link>
        </div>
      )}

      {!isFiltered && !isAdminUser(userInfo) && (
        <>
          <CategoriesSection />
          {!loadingTop ? (
            topProducts && topProducts.length > 0 ? (
              <section className='page-section page-container' id='featured'>
                <SectionHeader
                  title='Featured Products'
                  subtitle='Top rated picks from our collection'
                  actionLabel='View All'
                  actionTo='/page/1'
                />
                <ProductGrid>
                  {topProducts.slice(0, 4).map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </ProductGrid>
              </section>
            ) : null
          ) : (
            <section className='page-section page-container' id='featured'>
              <SectionHeader
                title='Featured Products'
                subtitle='Top rated picks from our collection'
              />
              <ProductGridSkeleton count={4} />
            </section>
          )}
          <PromoBanner />
        </>
      )}

      <section
        className={`page-section page-container ${isHome ? 'pt-0' : ''}`}
        id='products'
      >
        <SectionHeader
          title={
            isCategory
              ? category
              : isSearch
              ? `Results for "${keyword}"`
              : isAdminUser(userInfo)
              ? 'Product Catalog'
              : 'Latest Products'
          }
          subtitle={
            isCategory
              ? `${productCount} product${productCount === 1 ? '' : 's'} in this category`
              : isSearch
              ? `${productCount} product${productCount === 1 ? '' : 's'} found`
              : 'Fresh arrivals updated weekly'
          }
        />

        {isCategory && !category && (
          <Message variant='danger'>Category not found.</Message>
        )}

        {isLoading ? (
          <ProductGridSkeleton />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <Meta />
            {data.products.length === 0 ? (
              <Message>No products found in this category.</Message>
            ) : (
              <ProductGrid>
                {data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </ProductGrid>
            )}
            <div className='mt-4'>
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword || ''}
                categorySlug={categorySlug || ''}
              />
            </div>
          </>
        )}
      </section>

      {!isFiltered && !isAdminUser(userInfo) && (
        <Suspense fallback={null}>
          <BenefitsSection />
          <NewsletterSection />
        </Suspense>
      )}
    </>
  );
};

export default HomeScreen;
