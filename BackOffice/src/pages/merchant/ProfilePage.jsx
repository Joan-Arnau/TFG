import { useTranslation } from 'react-i18next';
import useMerchantProfileEditor from './hooks/useMerchantProfileEditor';
import MerchantProfileView from './components/MerchantProfileView';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const {
    shop,
    hasShop,
    loading,
    error,
    success,
    isEditing,
    draft,
    categories,
    categoriesLoading,
    startEditing,
    cancelEditing,
    setLocalizedField,
    setField,
    submit,
  } = useMerchantProfileEditor();

  if (loading && !shop) return <div>{t('common.loading', 'Loading...')}</div>;
  if (!hasShop) return <div>{t('merchant.shopNotFound', 'Shop profile not found.')}</div>;

  return (
    <MerchantProfileView
      t={t}
      shop={shop}
      draft={draft}
      categories={categories}
      categoriesLoading={categoriesLoading}
      language={i18n.language}
      isEditing={isEditing}
      saving={loading}
      onEdit={startEditing}
      onCancel={cancelEditing}
      onSubmit={submit}
      onLocalizedChange={setLocalizedField}
      onFieldChange={setField}
      error={error}
      success={success}
    />
  );
};

export default ProfilePage;
