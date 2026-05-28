import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import App from './App'
import { configService } from './api/services/configService'

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

vi.mock('./api/services/configService', () => ({
  configService: {
    getPublicConfig: vi.fn(),
  },
}))

afterEach(() => {
  vi.clearAllMocks()
})

test('renders the municipality title from public config', async () => {
  configService.getPublicConfig.mockResolvedValue({
    municipalityName: 'Ajuntament de Fontserena',
    branding: {
      primaryColor: '#14532d',
      secondaryColor: '#2563eb',
      logoUrl: '/seed-images/default.svg',
    },
  })

  render(<App />)

  expect(screen.getByText('PromoRural')).toBeInTheDocument()
  expect(screen.getByText('Ajuntament de Fontserena')).toBeInTheDocument()
  expect(screen.getByTestId('language-switcher')).toBeInTheDocument()

  expect(await screen.findByText('Ajuntament de Fontserena')).toBeInTheDocument()
  expect(document.title).toBe('PromoRural BackOffice - Ajuntament de Fontserena')
})

test('uses fallback theme when public config fails and keeps login accessible', async () => {
  configService.getPublicConfig.mockRejectedValue(new Error('config unavailable'))

  render(<App />)

  expect(screen.getByText('PromoRural')).toBeInTheDocument()
  expect(screen.getByText('Ajuntament de Fontserena')).toBeInTheDocument()
  expect(screen.getByTestId('language-switcher')).toBeInTheDocument()

  await waitFor(() => {
    expect(document.title).toBe('PromoRural BackOffice - Ajuntament de Fontserena')
  })
})

test('uses fallback values when public config is empty', async () => {
  configService.getPublicConfig.mockResolvedValue({
    municipalityName: '   ',
    branding: {
      primaryColor: '',
      secondaryColor: null,
      logoUrl: '',
    },
  })

  render(<App />)

  await waitFor(() => {
    expect(screen.getByText('PromoRural')).toBeInTheDocument()
    expect(screen.getByText('Ajuntament de Fontserena')).toBeInTheDocument()
    expect(document.documentElement.style.getPropertyValue('--brand-primary')).toBe('#0f172a')
    expect(document.documentElement.style.getPropertyValue('--brand-secondary')).toBe('#2563eb')
  })
})

test('replaces a broken configured logo with the fallback asset', async () => {
  configService.getPublicConfig.mockResolvedValue({
    municipalityName: 'Ajuntament',
    branding: {
      logoUrl: 'https://via.placeholder.com/200x200?text=Ajuntament',
    },
  })

  render(<App />)

  await screen.findByText('Ajuntament')
  const logo = document.querySelector('.app-brand-logo')
  expect(logo.getAttribute('src')).toBe('https://via.placeholder.com/200x200?text=Ajuntament')

  fireEvent.error(logo)

  expect(logo.getAttribute('src')).toContain('/src/assets/hero.png')
})
