import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../api/services/authService';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      setSuccess(true);
    } catch {
      setError(t('auth.forgotPasswordError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-card">
        <h2>{t('auth.forgotPasswordTitle')}</h2>
        <p className="auth-description">{t('auth.forgotPasswordDescription')}</p>
        {success ? (
          <p className="success">{t('auth.forgotPasswordSuccess')}</p>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('auth.email')}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? t('auth.submitting') : t('auth.forgotPasswordAction')}
            </button>
          </form>
        )}
        <div className="auth-links">
          <Link to="/login">{t('auth.backToLogin')}</Link>
        </div>
      </section>
    </div>
  );
};

export default ForgotPasswordPage;
