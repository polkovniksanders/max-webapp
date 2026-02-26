import { baseApi } from '@shared/api'
import type { ApiShop } from './apiTypes'

const SHOP_ID = 12

export const { useGetShopQuery } = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShop: builder.query<ApiShop, void>({
      query: () => `shops/${SHOP_ID}`,
      transformResponse: (response: { data: ApiShop }) => response.data,
    }),
  }),
})
