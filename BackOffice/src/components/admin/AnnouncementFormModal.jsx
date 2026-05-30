import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import InputI18n from '../forms/InputI18n';
import CategorySelect from '../forms/CategorySelect';
import { getLocalizedDraft, buildLocalizedMap } from '../../utils/localization';

const AnnouncementFormModal = ({ announcement, onClose, onSave, categories, t }) => {
  const [titleDraft, setTitleDraft] = useState({ ca: '', es: '', en: '' });
  const [contentDraft, setContentDraft] = useState({ ca: '', es: '', en: '' });
  const [categoryId, setCategoryId] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (announcement) {
        setTitleDraft(getLocalizedDraft(announcement.title));
        setContentDraft(getLocalizedDraft(announcement.content));
        setCategoryId(announcement.category?.id || '');
        setIsUrgent(announcement.urgent || announcement.isUrgent || false);
      } else {
        setTitleDraft({ ca: '', es: '', en: '' });
        setContentDraft({ ca: '', es: '', en: '' });
        setCategoryId(categories.length > 0 ? categories[0].id : '');
        setIsUrgent(false);
      }
      setError(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [announcement, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const defaultLang = localStorage.getItem('defaultLanguage') || 'ca';
    const isTitleFilled = titleDraft[defaultLang]?.trim() !== '';
    const isContentFilled = contentDraft[defaultLang]?.trim() !== '';

    if (!isTitleFilled) {
      setError(t('admin.announcements.errorTitleRequired', `El títol és obligatori en l'idioma per defecte (${defaultLang.toUpperCase()}).`));
      return;
    }
    if (!isContentFilled) {
      setError(t('admin.announcements.errorContentRequired', `El contingut és obligatori en l'idioma per defecte (${defaultLang.toUpperCase()}).`));
      return;
    }
    if (!categoryId) {
      setError(t('admin.announcements.errorCategoryRequired', 'La categoria és obligatòria.'));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        title: buildLocalizedMap(titleDraft),
        content: buildLocalizedMap(contentDraft),
        categoryId: Number(categoryId),
        urgent: isUrgent
      });
      onClose();
    } catch {
      setError(t('admin.announcements.saveError', 'Error al desar el bando.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="admin-category-modal">
        <h3>{announcement ? t('admin.announcements.editTitle', 'Editar Bando') : t('admin.announcements.addNew', 'Nou Bando')}</h3>
        {error && <div className="alert alert-danger mb-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <InputI18n
            label={t('admin.announcements.titleField', 'Títol')}
            value={titleDraft}
            onChange={(lang, val) => setTitleDraft({...titleDraft, [lang]: val})}
            placeholderKey="admin.announcements.titlePlaceholder"
          />
          <InputI18n
            label={t('admin.announcements.content', 'Contingut')}
            value={contentDraft}
            onChange={(lang, val) => setContentDraft({...contentDraft, [lang]: val})}
            placeholderKey="admin.announcements.contentPlaceholder"
            isTextArea
          />
          <div className="form-group">
            <label className="form-label">{t('admin.announcements.category', 'Categoria')}</label>
            <CategorySelect
              categories={categories}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder={t('admin.announcements.selectCategory', 'Selecciona categoria')}
            />
          </div>
          <div className="form-group" style={{ display: 'inline-flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem', marginTop: '1rem', width: 'fit-content' }}>
            <label htmlFor="urgent" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>{t('admin.announcements.urgent', 'És Urgent')}</label>
            <input type="checkbox" id="urgent" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} style={{ width: 'auto', margin: 0 }} />
          </div>
          <div className="admin-modal-actions mt-4" style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>{t('common.cancel', 'Cancel·lar')}</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? t('common.saving', 'Desant...') : t('common.save', 'Desar')}</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default AnnouncementFormModal;
