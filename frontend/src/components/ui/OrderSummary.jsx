const OrderSummary = ({ title = 'Order Summary', rows, total, children, footerLink }) => (
  <div className='cart-summary'>
    <h5 className='cart-summary__title'>{title}</h5>
    {rows.map(([label, value]) => (
      <div key={label} className='summary-row'>
        <span className='summary-row__label'>{label}</span>
        <span className='summary-row__value'>{value}</span>
      </div>
    ))}
    {total && (
      <>
        <hr className='my-3' />
        <div className='summary-total'>
          <span className='summary-total__label'>{total[0]}</span>
          <span className='summary-total__value'>{total[1]}</span>
        </div>
      </>
    )}
    {children}
    {footerLink}
  </div>
);

export default OrderSummary;
