import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { getLocalizedDraft, buildLocalizedMap } from '../../utils/localization';

const AnnouncementFormModal = ({ announcement, onClose, onSave, categories, t }) => {
  const { i18n } = useTranslation();
  const [titleDraft, setTitleDraft] = useState({ ca: '', es: '', en: '' });
  const [contentDraft, setContentDraft] = useState({ ca: '', es: '', en: '' });
  const [categoryId, setCategoryId] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState('ca');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (announcement) {
        setTitleDraft(getLocalizedDraft(announcement.title));
        setContentDraft(getLocalizedDraft(announcement.content));
        setCategoryId(announcement.category?.id || '');
        setIsUrgent(announcement.isUrgent || false);
      } else {
        setTitleDraft({ ca: '', es: '', en: '' });
        setContentDraft({ ca: '', es: '', en: '' });
        setCategoryId(categories.length > 0 ? categories[0].id : '');
        setIsUrgent(false);
      }
      setError(null);
    }, 0);
  }, [announcement, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Form Validation
    const isTitleFilled = Object.values(titleDraft).every(val => val.trim() !== '');
    const isContentFilled = Object.values(contentDraft).every(val => val.trim() !== '');

    if (!isTitleFilled) {
      setError(t('admin.announcements.errorTitleRequired', 'El títol és obligatori en tots els idiomes.'));
      return;
    }
    if (!isContentFilled) {
      setError(t('admin.announcements.errorContentRequired', 'El contingut és obligatori en tots els idiomes.'));
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

  const languages = [{code: 'ca', name: 'Català'}, {code: 'es', name: 'Castellano'}, {code: 'en', name: 'English'}];

  const isFormValid = Object.values(titleDraft).every(val => val.trim() !== '') &&
                      Object.values(contentDraft).every(val => val.trim() !== '') &&
                      categoryId !== '';

  return (
    <Modal onClose={onClose}>
      <h3>{announcement ? t('admin.announcements.editTitle', 'Editar Bando') : t('admin.announcements.addNew', 'Nou Bando')}</h3>
      {error && <div className="alert alert-danger mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{t('admin.announcements.title', 'Títol')}</label>
          <div className="lang-tabs mb-2">
            {languages.map(lang => (
              <button key={lang.code} type="button" className={`lang-tab-btn ${activeLangTab === lang.code ? 'active' : ''}`} onClick={() => setActiveLangTab(lang.code)}>{lang.name}</button>
            ))}
          </div>
          {languages.map(lang => (
            <div key={lang.code} style={{ display: activeLangTab === lang.code ? 'block' : 'none' }}>
              <label className="form-label mt-2">{t('admin.announcements.titleField', 'Títol')}</label>
              <input type="text" className="form-input mb-2" value={titleDraft[lang.code]} onChange={(e) => setTitleDraft({...titleDraft, [lang.code]: e.target.value})} placeholder={t('admin.announcements.titlePlaceholder', { lang: lang.name })} />

              <label className="form-label mt-2">{t('admin.announcements.content', 'Contingut')}</label>
              <textarea className="form-input" value={contentDraft[lang.code]} onChange={(e) => setContentDraft({...contentDraft, [lang.code]: e.target.value})} placeholder={t('admin.announcements.contentPlaceholder', { lang: lang.name })} />
            </div>
          ))}
          </div>
          <div className="form-group">
          <label className="form-label">{t('admin.announcements.category', 'Categoria')}</label>
          <select className="form-input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name[i18n.language] || cat.name['ca']}</option>)}
          </select>
          </div>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} id="urgent-check" />
            <label htmlFor="urgent-check" style={{ margin: 0 }}>{t('admin.announcements.urgent', 'És Urgent')}</label>
          </div>
        <div className="admin-modal-actions mt-4">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting} style={{marginRight: '8px'}}>{t('common.cancel', 'Cancel·lar')}</Button>
          <Button variant="primary" type="submit" disabled={isSubmitting || !isFormValid}>{isSubmitting ? t('common.saving', 'Desant...') : t('common.save', 'Desar')}</Button>
        </div>
      </form>
    </Modal>
  );
};
export default AnnouncementFormModal;
