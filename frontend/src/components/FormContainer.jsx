const FormContainer = ({ children, title, subtitle }) => {
  return (
    <div className='auth-card'>
      {title && <h1>{title}</h1>}
      {subtitle && <p className='subtitle'>{subtitle}</p>}
      {children}
    </div>
  );
};

export default FormContainer;
