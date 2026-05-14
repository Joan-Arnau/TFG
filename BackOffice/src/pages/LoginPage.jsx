import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { role } = await login({ username, password });
      const from = location.state?.from?.pathname || (role === 'ROLE_ADMIN' ? '/admin' : '/merchant');
      navigate(from, { replace: true });
    } catch {
      setError(t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-card">
        <h2>{t('auth.loginTitle')}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t('auth.username')}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('auth.password')}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? t('auth.submitting') : t('auth.loginAction')}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/register">{t('auth.registerLink')}</Link>
          <Link to="/forgot-password">{t('auth.forgotPasswordLink')}</Link>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
