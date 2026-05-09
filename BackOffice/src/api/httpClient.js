import axios from 'axios'
import i18n from '../i18n'

const tokenStorageKey = 'authToken'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost/api',
  timeout: 10000,
})

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(tokenStorageKey)
  const language = i18n.resolvedLanguage ?? i18n.language ?? 'ca'

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers['Accept-Language'] = language
  return config
})
