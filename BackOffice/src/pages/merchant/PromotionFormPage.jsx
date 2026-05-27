import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAsyncSubmit } from '../../hooks/useAsyncSubmit';
import { useMerchantPromotions } from './hooks/useMerchantPromotions';
import { MERCHANT_ROUTES } from './constants';

const PromotionFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [model, setModel] = useState({ title: '', description: '' });
  const { getPromotion, create, update, validatePromotion } = useMerchantPromotions();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      try {
        const p = await getPromotion(id);
        if (mounted) {
          const m = p || { title: '', description: '' };
          setModel(m);
          setTitle(m.title || '');
          setDescription(m.description || '');
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [id, getPromotion]);

  const { loading, error, handleSubmit } = useAsyncSubmit(async (data) => {
    if (id) {
      await update(id, data);
    } else {
      await create(data);
    }
    navigate(MERCHANT_ROUTES.PROMOTIONS);
  });

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ title, description });
  };

  return (
    <div>
      <h3>{id ? t('merchant.editPromotion', 'Edit Promotion') : t('merchant.newPromotion', 'New Promotion')}</h3>
      <form onSubmit={onSubmit}>
        <div>
          <label>{t('merchant.titleLabel', 'Title')}</label>
          <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>{t('merchant.descriptionLabel', 'Description')}</label>
          <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit" disabled={loading || !validatePromotion({ title, description })}>{loading ? t('merchant.saving', 'Saving...') : t('merchant.save', 'Save')}</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default PromotionFormPage;
