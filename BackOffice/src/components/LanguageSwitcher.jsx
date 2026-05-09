import { useTranslation } from 'react-i18next'

const supportedLanguages = ['ca', 'es', 'en']

function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value)
  }

  return (
    <div className="language-switcher">
      <label htmlFor="language-select">{t('language.label')}</label>
      <select
        id="language-select"
        value={i18n.resolvedLanguage ?? 'ca'}
        onChange={handleLanguageChange}
      >
        {supportedLanguages.map((languageCode) => (
          <option key={languageCode} value={languageCode}>
            {t(`language.${languageCode}`)}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitcher
