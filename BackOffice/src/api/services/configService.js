import { httpClient } from '../httpClient'
import { PUBLIC_API } from '../../constants'

export const configService = {
  getPublicConfig: async () => {
    const response = await httpClient.get(PUBLIC_API.CONFIG)
    return response.data
  },
}
