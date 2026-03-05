import { baseApi } from '@shared/api'
import type { ApiShop } from './apiTypes'

export const shopApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShop: builder.query<ApiShop, number>({
      query: (shopId) => `shops/${shopId}`,
      transformResponse: (response: { data: ApiShop }) => response.data,
    }),
  }),
})

export const { useGetShopQuery } = shopApiSlice
