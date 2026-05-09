import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import ca from './locals/ca.json'
import es from './locals/es.json'
import en from './locals/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ca: { translation: ca },
      es: { translation: es },
      en: { translation: en },
    },
    fallbackLng: 'ca',
    supportedLngs: ['ca', 'es', 'en'],
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
