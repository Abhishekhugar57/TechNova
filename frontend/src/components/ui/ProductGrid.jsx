const ProductGrid = ({ children, className = '' }) => (
  <div className={`product-grid ${className}`.trim()}>{children}</div>
);

export default ProductGrid;
