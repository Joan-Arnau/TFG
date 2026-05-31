import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { authService } from '../../api/services/authService';
import { useAsyncSubmit } from '../../hooks/common/useAsyncSubmit';
import AuthCard from '../../components/auth/AuthCard';
import PasswordField from '../../components/forms/PasswordField';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');

  const { loading, error, success, handleSubmit, setError } = useAsyncSubmit(
    (data) => authService.resetPassword(data)
  );

  const onSubmit = (event) => {
    event.preventDefault();
    if (!token) {
      setError(t('auth.resetPasswordMissingToken'));
      return;
    }
    handleSubmit({ token, newPassword });
  };

  return (
    <AuthCard
      title={t('auth.resetPasswordTitle')}
      success={success}
      successMessage={t('auth.resetPasswordSuccess')}
      error={error}
      links={[{ to: '/login', label: t('auth.backToLogin') }]}
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <PasswordField
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder={t('auth.newPassword')}
          minLength={8}
          required
          disabled={!token}
        />
        <button type="submit" disabled={loading || !token}>
          {loading ? t('auth.submitting') : t('auth.resetPasswordAction')}
        </button>
      </form>
    </AuthCard>
  );
};

export default ResetPasswordPage;
