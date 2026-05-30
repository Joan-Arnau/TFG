import { useEffect, useMemo, useState } from 'react'
import { configService } from '../api/services/configService'
import { ThemeStateContext } from './ThemeStateContext'
import { APP_NAME, DEFAULT_THEME, normalizeThemeConfig } from './themeConfig'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(DEFAULT_THEME)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    configService
      .getPublicConfig()
      .then((config) => {
        if (!mounted) return
        if (config?.defaultLanguage) {
          localStorage.setItem('defaultLanguage', config.defaultLanguage);
        }
        if (config?.supportedLanguages) {
          localStorage.setItem('supportedLanguages', JSON.stringify(config.supportedLanguages));
        }
        setTheme(normalizeThemeConfig(config))
        setError(null)
      })
      .catch((requestError) => {
        if (!mounted) return
        setTheme(DEFAULT_THEME)
        setError(requestError)
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-primary', theme.primaryColor)
    document.documentElement.style.setProperty('--brand-secondary', theme.secondaryColor)
    document.documentElement.style.setProperty('--brand-primary-contrast', theme.primaryContrast)
    document.documentElement.style.setProperty('--brand-surface', '#ffffff')
    document.documentElement.style.setProperty('--brand-muted', '#e2e8f0')
    document.title = `${APP_NAME} BackOffice - ${theme.name}`
  }, [theme])

  const value = useMemo(() => ({ theme, isLoading, error }), [theme, isLoading, error])

  return <ThemeStateContext.Provider value={value}>{children}</ThemeStateContext.Provider>
}
