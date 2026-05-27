import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MERCHANT_ROUTES } from '../../../pages/merchant/constants';
import { useAuth } from '../../../context/AuthContext';
import { useAsyncSubmit } from '../../../hooks/useAsyncSubmit';
import AuthCard from '../../../components/auth/AuthCard';
import TextField from '../../../components/forms/TextField';
import PasswordField from '../../../components/forms/PasswordField';

const LoginPage = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, handleSubmit } = useAsyncSubmit(
    async (credentials) => {
      try {
        return await login(credentials);
      } catch {
        throw new Error(t('auth.invalidCredentials'));
      }
    },
    (user) => {
      const from = location.state?.from?.pathname || (user.role === 'ROLE_ADMIN' ? '/admin' : MERCHANT_ROUTES.BASE);
      navigate(from, { replace: true });
    }
  );

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ username, password });
  };

  return (
    <AuthCard
      title={t('auth.loginTitle')}
      error={error}
      links={[
        { to: '/register', label: t('auth.registerLink') },
        { to: '/forgot-password', label: t('auth.forgotPasswordLink') }
      ]}
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <TextField
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t('auth.username')}
          required
        />
        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.password')}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? t('auth.submitting') : t('auth.loginAction')}
        </button>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
