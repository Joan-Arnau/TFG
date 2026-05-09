import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './components/LanguageSwitcher'
import './App.css'
import { httpClient } from './api/httpClient'

function App() {
  const { t } = useTranslation()

  return (
    <main className="app">
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <LanguageSwitcher />
      </header>

      <section className="panel panel-inline">
        <span>{t('app.apiBaseUrl')}</span>
        <code>{httpClient.defaults.baseURL}</code>
      </section>
    </main>
  )
}

export default App
