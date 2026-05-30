import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/useTheme';

const InputI18n = ({ label, value, onChange, errors, placeholderKey, isTextArea = false }) => {
  const { t } = useTranslation();
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

  const [activeLangTab, setActiveLangTab] = useState(defaultLanguageCode);

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
    // Ensure value is initialized as an object
    const timer = setTimeout(() => {
      if (typeof value !== 'object' || value === null) {
        onChange(defaultLanguageCode, ''); // Default to empty string for default language
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [value, onChange, defaultLanguageCode]);


  const handleInputChange = (lang, val) => {
    onChange(lang, val);
  };


  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      
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
            {value[lang.code]?.trim() && <span className="lang-filled-indicator">•</span>}
          </button>
        ))}
      </div>

      {/* Tab Inputs */}
      {languages.map((lang) => (
        <div
          key={lang.code}
          style={{ display: activeLangTab === lang.code ? 'block' : 'none' }}
        >
          {isTextArea ? (
            <textarea
              className="form-input"
              value={value[lang.code] || ''}
              onChange={(e) => handleInputChange(lang.code, e.target.value)}
              placeholder={t(placeholderKey, { lang: lang.name })}
              rows="4"
            />
          ) : (
            <input
              type="text"
              className="form-input"
              value={value[lang.code] || ''}
              onChange={(e) => handleInputChange(lang.code, e.target.value)}
              placeholder={t(placeholderKey, { lang: lang.name })}
            />
          )}
          {errors && errors[lang.code] && <p className="error-message">{errors[lang.code]}</p>}
        </div>
      ))}
      {errors && typeof errors === 'string' && <p className="error-message">{errors}</p>} {/* General error message */}
    </div>
  );
};

export default InputI18n;
