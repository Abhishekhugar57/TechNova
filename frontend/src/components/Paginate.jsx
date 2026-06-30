import { Link } from 'react-router-dom';

const Paginate = ({
  pages,
  page,
  isAdmin = false,
  keyword = '',
  categorySlug = '',
}) => {
  if (pages <= 1) return null;

  const buildPath = (pageNum) => {
    if (isAdmin) return `/admin/productlist/${pageNum}`;
    if (categorySlug) return `/category/${categorySlug}/page/${pageNum}`;
    if (keyword) return `/search/${keyword}/page/${pageNum}`;
    return `/page/${pageNum}`;
  };

  return (
    <ul className='pagination-custom'>
      {[...Array(pages).keys()].map((x) => {
        const pageNum = x + 1;
        const to = buildPath(pageNum);

        return (
          <li
            key={pageNum}
            className={`pagination-custom__item ${pageNum === page ? 'active' : ''}`}
          >
            {pageNum === page ? (
              <span>{pageNum}</span>
            ) : (
              <Link to={to}>{pageNum}</Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Paginate;
