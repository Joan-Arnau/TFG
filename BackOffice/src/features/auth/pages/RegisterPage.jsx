import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../../../api/services/authService';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import AuthCard from '../../../components/auth/AuthCard';
import TextField from '../../../components/forms/TextField';
import PasswordField from '../../../components/forms/PasswordField';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    shopName: '',
    shopDescription: '',
    address: '',
    phoneNumber: '',
  });

  const { loading, error, success, handleSubmit } = useAsyncSubmit(
    async (data) => {
      try {
        return await authService.register(data);
      } catch {
        throw new Error(t('auth.registerError'));
      }
    }
  );

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(formData);
  };

  return (
    <AuthCard
      title={t('auth.registerTitle')}
      success={success}
      successMessage={t('auth.registerSuccess')}
      error={error}
      links={[{ to: '/login', label: t('auth.backToLogin') }]}
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <TextField
          value={formData.username}
          onChange={handleChange('username')}
          placeholder={t('auth.username')}
          required
        />
        <TextField
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder={t('auth.email')}
          required
        />
        <PasswordField
          value={formData.password}
          onChange={handleChange('password')}
          placeholder={t('auth.password')}
          minLength={8}
          required
        />
        <TextField
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
        <TextField
          value={formData.address}
          onChange={handleChange('address')}
          placeholder={t('auth.address')}
          required
        />
        <TextField
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
    </AuthCard>
  );
};

export default RegisterPage;
