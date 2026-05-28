import { createContext } from 'react'
import { DEFAULT_THEME } from './themeConfig'

export const ThemeStateContext = createContext({
  theme: DEFAULT_THEME,
  isLoading: false,
  error: null,
})
