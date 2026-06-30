import { lazy, Suspense } from 'react';
import PageLoader from '../components/PageLoader';

export const lazyPage = (importFn) => {
  const LazyComponent = lazy(importFn);

  const Wrapped = (props) => (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );

  Wrapped.displayName = 'LazyPage';
  return Wrapped;
};
