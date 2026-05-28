import fallbackLogo from '../assets/hero.png'
import { resolveBackendStaticUrl } from '../utils/backendUrls'

const HEX_COLOR = /^#([A-Fa-f0-9]{6})$/

export const APP_NAME = 'PromoRural'

export const DEFAULT_THEME = {
  name: 'Ajuntament de Fontserena',
  logoUrl: fallbackLogo,
  primaryColor: '#0f172a',
  secondaryColor: '#2563eb',
  primaryContrast: '#ffffff',
}

const pickText = (...values) => values.find((value) => typeof value === 'string' && value.trim())?.trim()

const pickColor = (value, fallback) => (typeof value === 'string' && HEX_COLOR.test(value) ? value : fallback)

export const normalizeThemeConfig = (config) => {
  const branding = config?.branding ?? {}

  return {
    name: pickText(config?.municipalityName, config?.name, branding.municipalityName, branding.name, DEFAULT_THEME.name),
    logoUrl: resolveBackendStaticUrl(pickText(branding.logoUrl, config?.logoUrl, DEFAULT_THEME.logoUrl)),
    primaryColor: pickColor(branding.primaryColor, DEFAULT_THEME.primaryColor),
    secondaryColor: pickColor(branding.secondaryColor, DEFAULT_THEME.secondaryColor),
    primaryContrast: DEFAULT_THEME.primaryContrast,
  }
}
