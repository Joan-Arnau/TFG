import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const InputI18n = ({ label, value, onChange, errors, placeholderKey, isTextArea = false }) => {
  const { t } = useTranslation();
  const [activeLangTab, setActiveLangTab] = useState('ca'); // Default to 'ca'

  useEffect(() => {
    // Ensure value is initialized as an object
    if (typeof value !== 'object' || value === null) {
      onChange('ca', ''); // Default to empty string for 'ca'
    }
  }, [value, onChange]);

  const languages = [
    { code: 'ca', name: 'Català' },
    { code: 'es', name: 'Castellano' },
    { code: 'en', name: 'English' },
  ];

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
