import { useTranslation } from 'react-i18next';
import { useMerchantImages } from '../../hooks/merchant/useMerchantImages';
import MerchantImagesView from '../../components/merchant/MerchantImagesView';

const ImagesPage = () => {
  const { t } = useTranslation();
  const { images, stageUpload, saveUpload, remove, uploading, uploadError, pendingPreviewUrl } = useMerchantImages();

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await stageUpload(file);
    e.target.value = '';
  };

  return (
    <MerchantImagesView
      t={t}
      images={images}
      onUpload={onFileChange}
      onSave={saveUpload}
      onDelete={remove}
      uploading={uploading}
      uploadError={uploadError}
      pendingPreviewUrl={pendingPreviewUrl}
    />
  );
};

export default ImagesPage;
