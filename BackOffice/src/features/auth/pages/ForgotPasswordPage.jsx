import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../../../api/services/authService';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import AuthCard from '../../../components/auth/AuthCard';
import TextField from '../../../components/forms/TextField';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  
  const { loading, error, success, handleSubmit } = useAsyncSubmit(
    (data) => authService.forgotPassword(data)
  );

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit({ email });
  };

  return (
    <AuthCard
      title={t('auth.forgotPasswordTitle')}
      success={success}
      successMessage={t('auth.forgotPasswordSuccess')}
      error={error}
      links={[{ to: '/login', label: t('auth.backToLogin') }]}
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <TextField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.email')}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? t('auth.submitting') : t('auth.forgotPasswordAction')}
        </button>
      </form>
    </AuthCard>
  );
};

export default ForgotPasswordPage;
