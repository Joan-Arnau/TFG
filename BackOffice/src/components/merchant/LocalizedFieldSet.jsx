import { useTheme } from '../../context/useTheme';

const LocalizedFieldSet = ({ legend, values, onChange, renderAs = 'input', rows = 4, requiredLanguage = null, t, className = '' }) => {
  const FieldComponent = renderAs;
  const { theme } = useTheme();

  const supportedLanguageCodes = theme?.supportedLanguages || ['ca', 'es', 'en'];
  const defaultLanguageCode = theme?.defaultLanguage || 'ca';

  // Determine the active required language based on what's configured
  const activeRequiredLanguage = requiredLanguage && supportedLanguageCodes.includes(requiredLanguage)
    ? requiredLanguage
    : defaultLanguageCode;

  return (
    <fieldset className={`merchant-fieldset ${className}`.trim()}>
      <legend>{legend}</legend>
      {supportedLanguageCodes.map((lang) => (
        <label key={lang}>
          <span>{t(`language.${lang}`, lang.toUpperCase())}</span>
          <FieldComponent
            value={values[lang] || ''}
            onChange={(event) => onChange(lang, event.target.value)}
            required={Boolean(requiredLanguage) && lang === activeRequiredLanguage}
            rows={FieldComponent === 'textarea' ? rows : undefined}
          />
        </label>
      ))}
    </fieldset>
  );
};

export default LocalizedFieldSet;
