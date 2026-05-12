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

vi.mock('./components/LanguageSwitcher', () => ({
  default: () => <div data-testid="language-switcher" />,
}))

test('renders the mobile app shell and API base URL label', () => {
  render(<App />)

  expect(screen.getByRole('heading', { name: 'app.title' })).toBeInTheDocument()
  expect(screen.getByText('app.apiBaseUrl')).toBeInTheDocument()
  expect(screen.getByTestId('language-switcher')).toBeInTheDocument()
})
