import { Link } from 'react-router-dom';

const AuthCard = ({ title, children, success, successMessage, error, links = [] }) => {

  return (
    <div className="auth-page">
      <section className="auth-card">
        <h2>{title}</h2>
        {success ? (
          <p className="success">{successMessage}</p>
        ) : (
          <>
            {error && <p className="error">{error}</p>}
            {children}
          </>
        )}
        <div className="auth-links">
          {links.map((link, index) => (
            <Link key={index} to={link.to}>{link.label}</Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AuthCard;
