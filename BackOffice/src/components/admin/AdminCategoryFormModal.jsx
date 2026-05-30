import { useEffect, useState, useMemo } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { getLocalizedDraft, buildLocalizedMap } from '../../utils/localization';
import { useTheme } from '../../context/useTheme';

const AdminCategoryFormModal = ({ category, onClose, onSave, t }) => {
  const { theme } = useTheme();
  
  const supportedLanguageCodes = useMemo(() => {
    return theme?.supportedLanguages || ['ca', 'es', 'en'];
  }, [theme?.supportedLanguages]);
  
  const defaultLanguageCode = theme?.defaultLanguage || 'ca';

  const allLanguages = [
    { code: 'ca', name: 'Català' },
    { code: 'es', name: 'Castellano' },
    { code: 'en', name: 'English' },
  ];

  const languages = allLanguages.filter(lang => supportedLanguageCodes.includes(lang.code));

  const [nameDraft, setNameDraft] = useState({ ca: '', es: '', en: '' });
  const [type, setType] = useState('SHOP');
  const [activeLangTab, setActiveLangTab] = useState(defaultLanguageCode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (defaultLanguageCode && supportedLanguageCodes.includes(defaultLanguageCode)) {
        setActiveLangTab(defaultLanguageCode);
      } else if (supportedLanguageCodes.length > 0) {
        setActiveLangTab(supportedLanguageCodes[0]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [defaultLanguageCode, supportedLanguageCodes]);



  useEffect(() => {
    const timer = setTimeout(() => {
      if (category) {
        setNameDraft(getLocalizedDraft(category.name));
        setType(category.type || 'SHOP');
      } else {
        setNameDraft({ ca: '', es: '', en: '' });
        setType('SHOP');
      }
      setError(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [category]);

  const handleNameChange = (lang, val) => {
    setNameDraft((prev) => ({ ...prev, [lang]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!nameDraft.ca.trim() && !nameDraft.es.trim() && !nameDraft.en.trim()) {
      setError(t('admin.categories.nameRequired', 'At least one name in any language is required.'));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: buildLocalizedMap(nameDraft),
        type,
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      console.error('Error saving category:', err);
      // Try to parse message from backend error
      const backendMessage = err.response?.data?.message || err.message;
      setError(backendMessage || t('admin.categories.saveError', 'Failed to save category.'));
    } finally {
      setIsSubmitting(false);
    }
  };


  const types = [
    { code: 'SHOP', label: t('admin.categoryTypes.shop', 'Comerç') },
    { code: 'ANNOUNCEMENT', label: t('admin.categoryTypes.announcement', 'Comunicat') },
    { code: 'EVENT', label: t('admin.categoryTypes.event', 'Esdeveniment') },
    { code: 'POI', label: t('admin.categoryTypes.poi', 'Punt d\'Interès') },
    { code: 'CONTACT', label: t('admin.categoryTypes.contact', 'Telèfon d\'Interès') },
  ];

  return (
    <Modal onClose={onClose}>
      <div className="admin-category-modal">
        <h3>
          {category
            ? t('admin.categories.editTitle', 'Edit Category')
            : t('admin.categories.createTitle', 'Create New Category')}
        </h3>

        {error && <div className="alert alert-danger mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Multilingual Name field */}
          <div className="form-group">
            <label className="form-label">{t('admin.categories.nameLabel', 'Category Name')}</label>
            
            {/* Lang Tabs */}
            <div className="lang-tabs mb-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className={`lang-tab-btn ${activeLangTab === lang.code ? 'active' : ''}`}
                  onClick={() => setActiveLangTab(lang.code)}
                >
                  {lang.name}
                  {nameDraft[lang.code]?.trim() && <span className="lang-filled-indicator">•</span>}
                </button>
              ))}
            </div>

            {/* Tab Inputs */}
            {languages.map((lang) => (
              <div
                key={lang.code}
                style={{ display: activeLangTab === lang.code ? 'block' : 'none' }}
              >
                <input
                  type="text"
                  className="form-input"
                  value={nameDraft[lang.code]}
                  onChange={(e) => handleNameChange(lang.code, e.target.value)}
                  placeholder={t('admin.categories.namePlaceholder', { lang: lang.name })}
                />
              </div>
            ))}
          </div>

          {/* Type field */}
          <div className="form-group">
            <label className="form-label">{t('admin.categories.typeLabel', 'Type')}</label>
            <select
              className="form-input"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={!!category} // Typically category types shouldn't change to prevent confusion, or let it change if not used
            >
              {types.map((tItem) => (
                <option key={tItem.code} value={tItem.code}>
                  {tItem.label}
                </option>
              ))}
            </select>
            {category && (
              <span className="shop-table-subtext mt-1 d-block">
                {t('admin.categories.typeDisabledNote', 'The type cannot be modified once a category has been created.')}
              </span>
            )}
          </div>

          <div className="admin-modal-actions mt-4">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t('common.saving', 'Saving...')
                : t('common.save', 'Save')}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AdminCategoryFormModal;
