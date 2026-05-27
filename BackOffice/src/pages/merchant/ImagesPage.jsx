import { useTranslation } from 'react-i18next';
import { useMerchantImages } from './hooks/useMerchantImages';
import MerchantImagesView from './components/MerchantImagesView';

const ImagesPage = () => {
  const { t } = useTranslation();
  const { images, upload, remove } = useMerchantImages();

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await upload(file);
  };

  return (
    <MerchantImagesView t={t} images={images} onUpload={onFileChange} onDelete={remove} />
  );
};

export default ImagesPage;
