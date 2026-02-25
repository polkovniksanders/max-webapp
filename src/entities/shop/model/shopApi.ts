import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ApiShop } from './apiTypes'

const SHOP_ID = 12

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.spodial.com/api/v3/' }),
  endpoints: (builder) => ({
    getShop: builder.query<ApiShop, void>({
      query: () => `shops/${SHOP_ID}`,
      transformResponse: (response: { data: ApiShop }) => response.data,
    }),
  }),
})

export const { useGetShopQuery } = shopApi
