import { useState } from 'react';
import { toast } from 'react-toastify';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <section className='page-section page-container'>
      <div className='newsletter-section animate-in'>
        <h3>Stay in the Loop</h3>
        <p>
          Get exclusive deals, new arrivals, and style tips delivered to your
          inbox.
        </p>
        <form onSubmit={handleSubmit} className='newsletter-section__form'>
          <input
            type='email'
            className='form-control form-control-modern'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label='Email address'
          />
          <button type='submit' className='btn-accent'>
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
