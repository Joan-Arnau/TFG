import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './components/LanguageSwitcher'
import { httpClient } from './api/httpClient'
import './App.css'

function App() {
  const { t } = useTranslation()

  return (
    <main className="app">
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <LanguageSwitcher />
      </header>

      <section className="panel">
        <h2>{t('app.sectionAdmin')}</h2>
        <p>{t('app.sectionAdminDescription')}</p>
      </section>

      <section className="panel">
        <h2>{t('app.sectionMerchant')}</h2>
        <p>{t('app.sectionMerchantDescription')}</p>
      </section>

      <section className="panel panel-inline">
        <span>{t('app.apiBaseUrl')}</span>
        <code>{httpClient.defaults.baseURL}</code>
      </section>
    </main>
  )
}

export default App
