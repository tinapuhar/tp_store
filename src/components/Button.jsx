import './Button.scss';

const Button = ({ children, title, variant = "", className = "", ...props }) => {
  const combinedClasses = `btn ${variant} ${className}`.trim();

  return (
    <button className={combinedClasses} title={title} {...props}>
      {children || title}
    </button>
  );
};

export default Button;