import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

const steps = [
  { key: 'signin', label: 'Sign In', to: '/login?redirect=/shipping', step: 1 },
  { key: 'shipping', label: 'Shipping', to: '/shipping', step: 2 },
  { key: 'payment', label: 'Payment', to: '/payment', step: 3 },
  { key: 'placeorder', label: 'Place Order', to: '/placeorder', step: 4 },
];

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const activeFlags = [step1, step2, step3, step4];
  const currentIndex = activeFlags.reduce(
    (last, flag, index) => (flag ? index : last),
    -1
  );

  return (
    <nav className='checkout-steps' aria-label='Checkout progress'>
      {steps.map(({ key, label, to, step }, index) => {
        const isCurrent = index === currentIndex;
        const isCompleted = index < currentIndex;
        const isFuture = index > currentIndex;

        return (
          <div key={key} className='checkout-step-wrap'>
            {index > 0 && (
              <div
                className={`checkout-step__line ${
                  isCompleted || isCurrent ? 'checkout-step__line--done' : ''
                }`}
              />
            )}
            {isCompleted ? (
              <Link to={to} className='checkout-step completed p-0'>
                <span className='checkout-step__dot'>
                  <FaCheck size={12} />
                </span>
                {label}
              </Link>
            ) : isCurrent ? (
              <span className='checkout-step active p-0' aria-current='step'>
                <span className='checkout-step__dot'>{step}</span>
                {label}
              </span>
            ) : (
              <span
                className={`checkout-step p-0 ${isFuture ? 'checkout-step--future' : ''}`}
                aria-disabled='true'
              >
                <span className='checkout-step__dot'>{step}</span>
                {label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default CheckoutSteps;
