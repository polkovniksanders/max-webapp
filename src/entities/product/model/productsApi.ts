import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ApiProduct } from './apiTypes'

const SHOP_ID = 12
const USER_TG_ID = 5492444

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.spodial.com/api/v3/' }),
  endpoints: (builder) => ({
    getCategoryProducts: builder.query<ApiProduct[], number>({
      query: (categoryId) =>
        `categories/${categoryId}/products?category_id=${categoryId}&id=${SHOP_ID}&limit=4&offset=0&status[]=2&title=&unique_by_group=false&user_tg_id=${USER_TG_ID}`,
      transformResponse: (response: { data: ApiProduct[] }) => response.data ?? [],
    }),
  }),
})

export const { useLazyGetCategoryProductsQuery } = productsApi
