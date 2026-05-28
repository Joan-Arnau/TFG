import { httpClient } from '../httpClient'

export const configService = {
  getPublicConfig: async () => {
    const response = await httpClient.get('/public/config')
    return response.data
  },
}
