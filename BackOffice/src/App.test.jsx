import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import App from './App'

vi.mock('react-i18next', () => ({
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
  useTranslation: () => ({
    t: (key) => key,
  }),
}))

vi.mock('./components/common/LanguageSwitcher', () => ({
  default: () => <div data-testid="language-switcher" />,
}))

test('renders the backoffice title and language switcher', () => {
  render(<App />)

  expect(screen.getByText('PromoRural BackOffice')).toBeInTheDocument()
  expect(screen.getByTestId('language-switcher')).toBeInTheDocument()
})
