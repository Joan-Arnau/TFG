const TextField = ({ type = 'text', ...props }) => (
  <input type={type} {...props} />
);

export default TextField;
