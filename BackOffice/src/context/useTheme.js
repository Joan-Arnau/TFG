import { useContext } from 'react'
import { ThemeStateContext } from './ThemeStateContext'

export const useTheme = () => useContext(ThemeStateContext)
