const variantMap = {
  danger: 'alert-custom--danger',
  success: 'alert-custom--success',
  warning: 'alert-custom--warning',
  info: 'alert-custom--info',
};

const Message = ({ variant, children, className = '' }) => {
  const styleClass = variant ? variantMap[variant] : 'alert-custom--default';

  return (
    <div className={`alert-custom ${styleClass} ${className}`} role='alert'>
      {children}
    </div>
  );
};

export default Message;
