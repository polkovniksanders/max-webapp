import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ApiCategory } from './types'

const SHOP_ID = 12
const TELEGRAM_USER_ID = 5492444

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.spodial.com/api/v3/' }),
  endpoints: (builder) => ({
    getCategories: builder.query<ApiCategory[], void>({
      query: () =>
        `products/category?has_products=1&shop_id=${SHOP_ID}&telegram_user_id=${TELEGRAM_USER_ID}`,
      transformResponse: (response: { data: ApiCategory[] }) => response.data,
    }),
  }),
})

export const { useGetCategoriesQuery } = categoriesApi
