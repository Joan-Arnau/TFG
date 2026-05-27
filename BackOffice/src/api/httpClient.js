import axios from 'axios'
import i18n from '../i18n'

const tokenStorageKey = 'authToken'
const publicAuthPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
]

const shouldSkipAuthHeader = (url = '') => publicAuthPaths.some((path) => url.includes(path))

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10000,
})

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(tokenStorageKey)
  const language = i18n.resolvedLanguage ?? i18n.language ?? 'ca'
  const requestUrl = config.url ?? ''

  if (token && !shouldSkipAuthHeader(requestUrl)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['Accept-Language'] = language
  return config
})
