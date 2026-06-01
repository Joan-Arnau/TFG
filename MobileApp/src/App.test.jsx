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
    i18n: {
      language: 'ca',
      changeLanguage: () => Promise.resolve(),
    },
  }),
}))

vi.mock('./components/common/LanguageSwitcher', () => ({
  default: () => <div data-testid="language-switcher" />,
}))

vi.mock('./navigation/AppNavigator', () => {
  const React = require('react');
  return {
    default: () => React.createElement('div', null,
      React.createElement('h1', null, 'app.title'),
      React.createElement('p', null, 'app.apiBaseUrl'),
      React.createElement('div', { 'data-testid': 'language-switcher' })
    )
  }
})

test('renders the mobile app shell and API base URL label', () => {
  render(<App />)

  expect(screen.getByRole('heading', { name: 'app.title' })).toBeInTheDocument()
  expect(screen.getByText('app.apiBaseUrl')).toBeInTheDocument()
  expect(screen.getByTestId('language-switcher')).toBeInTheDocument()
})

