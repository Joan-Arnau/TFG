import { MERCHANT_LANGUAGES } from '../constants';

const LocalizedFieldSet = ({ legend, values, onChange, renderAs = 'input', rows = 4, requiredLanguage = null, t }) => {
  const FieldComponent = renderAs;

  return (
    <fieldset className="merchant-fieldset">
      <legend>{legend}</legend>
      {MERCHANT_LANGUAGES.map((lang) => (
        <label key={lang}>
          <span>{t(`language.${lang}`, lang.toUpperCase())}</span>
          <FieldComponent
            value={values[lang]}
            onChange={(event) => onChange(lang, event.target.value)}
            required={Boolean(requiredLanguage) && lang === requiredLanguage}
            rows={FieldComponent === 'textarea' ? rows : undefined}
          />
        </label>
      ))}
    </fieldset>
  );
};

export default LocalizedFieldSet;