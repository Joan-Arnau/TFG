import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../api/services/authService';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    shopName: '',
    shopDescription: '',
    address: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      setSuccess(true);
    } catch {
      setError(t('auth.registerError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-card">
        <h2>{t('auth.registerTitle')}</h2>
        {success ? (
          <p className="success">{t('auth.registerSuccess')}</p>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder={t('auth.email')}
              required
            />
            <input
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder={t('auth.password')}
              minLength={6}
              required
            />
            <input
              type="text"
              value={formData.shopName}
              onChange={handleChange('shopName')}
              placeholder={t('auth.shopName')}
              required
            />
            <textarea
              value={formData.shopDescription}
              onChange={handleChange('shopDescription')}
              placeholder={t('auth.shopDescription')}
              rows={3}
              required
            />
            <input
              type="text"
              value={formData.address}
              onChange={handleChange('address')}
              placeholder={t('auth.address')}
              required
            />
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              placeholder={t('auth.phoneNumber')}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? t('auth.submitting') : t('auth.registerAction')}
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

export default RegisterPage;
