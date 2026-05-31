import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useMerchantPromotionForm from '../../hooks/merchant/useMerchantPromotionForm';
import MerchantPromotionFormView from '../../components/merchant/MerchantPromotionFormView';

const PromotionFormPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { draft, loading, error, canSubmit, submit, setLocalizedField, setField, uploadImage, uploading, uploadError, validationMessage } = useMerchantPromotionForm(id);

  return (
    <MerchantPromotionFormView
      key={id || 'new'}
      t={t}
      title={id ? t('merchant.editPromotion', 'Edit Promotion') : t('merchant.newPromotion', 'New Promotion')}
      draft={draft}
      onLocalizedChange={setLocalizedField}
      onFieldChange={setField}
      onSubmit={submit}
      onFileUpload={uploadImage}
      uploading={uploading}
      uploadError={uploadError}
      validationMessage={validationMessage}
      canSubmit={canSubmit}
      saving={loading}
      error={error}
      isEdit={Boolean(id)}
    />
  );
};

export default PromotionFormPage;
