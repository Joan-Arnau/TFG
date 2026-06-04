import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../../api/services/authService';
import { useAsyncSubmit } from '../../hooks/common/useAsyncSubmit';
import AuthCard from '../../components/auth/AuthCard';
import TextField from '../../components/forms/TextField';
import PasswordField from '../../components/forms/PasswordField';

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
    privacyAccepted: false,
  });

  const { loading, error, success, handleSubmit } = useAsyncSubmit(
    async (data) => {
      try {
        // Exclude privacyAccepted checkbox from payload sent to backend
        const { privacyAccepted, ...payload } = data;
        return await authService.register(payload);
      } catch {
        throw new Error(t('auth.registerError'));
      }
    }
  );

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!formData.privacyAccepted) {
      return;
    }
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
        <div className="privacy-checkbox-wrapper" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '16px', marginBottom: '16px' }}>
          <input
            type="checkbox"
            id="privacyAccepted"
            checked={formData.privacyAccepted}
            onChange={handleChange('privacyAccepted')}
            required
            style={{ marginTop: '4px', cursor: 'pointer', width: 'auto' }}
          />
          <label htmlFor="privacyAccepted" style={{ fontSize: '0.85rem', color: '#555555', cursor: 'pointer', lineHeight: '1.4', textAlign: 'left' }}>
            {t('auth.privacyText', "Accepto la política de privacitat. Entenc i accepto que les dades de la fitxa del comerç (nom, descripció, adreça, telèfon i imatges) són de caràcter públic i es mostraran a la ciutadania, havent minimitzat la captura a les dades estrictament necessàries per oferir el servei d'aparador.")}
          </label>
        </div>
        <button type="submit" disabled={loading || !formData.privacyAccepted}>
          {loading ? t('auth.submitting') : t('auth.registerAction')}
        </button>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
