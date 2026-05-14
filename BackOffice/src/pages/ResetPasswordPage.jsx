import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../api/services/authService';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      setError(t('auth.resetPasswordMissingToken'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authService.resetPassword({ token, newPassword });
      setSuccess(true);
    } catch {
      setError(t('auth.resetPasswordError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-card">
        <h2>{t('auth.resetPasswordTitle')}</h2>
        {success ? (
          <p className="success">{t('auth.resetPasswordSuccess')}</p>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder={t('auth.newPassword')}
              minLength={6}
              required
              disabled={!token}
            />
            <button type="submit" disabled={loading || !token}>
              {loading ? t('auth.submitting') : t('auth.resetPasswordAction')}
            </button>
          </form>
        )}
        {!token && <p className="error">{t('auth.resetPasswordMissingToken')}</p>}
        <div className="auth-links">
          <Link to="/login">{t('auth.backToLogin')}</Link>
        </div>
      </section>
    </div>
  );
};

export default ResetPasswordPage;
