import { useTranslation } from 'react-i18next'

const supportedLanguages = [
  { code: 'ca', label: 'Català' },
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' }
]

function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value)
  }

  return (
    <div className="language-switcher">
      <select
        id="language-select"
        value={i18n.resolvedLanguage || i18n.language || 'ca'}
        onChange={handleLanguageChange}
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitcher
