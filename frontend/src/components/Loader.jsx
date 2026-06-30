const Loader = ({ size = 'default' }) => (
  <div className='loader-custom' role='status' aria-label='Loading'>
    <div
      className={`loader-custom__spinner ${
        size === 'small' ? 'loader-custom__spinner--sm' : 'loader-custom__spinner--md'
      }`}
    />
  </div>
);

export default Loader;
