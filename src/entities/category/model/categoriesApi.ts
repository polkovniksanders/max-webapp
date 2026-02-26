import { baseApi } from '@shared/api'
import type { ApiCategory } from './types'

const SHOP_ID = 12
const TELEGRAM_USER_ID = 5492444

export const { useGetCategoriesQuery } = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ApiCategory[], void>({
      query: () =>
        `products/category?has_products=1&shop_id=${SHOP_ID}&telegram_user_id=${TELEGRAM_USER_ID}`,
      transformResponse: (response: { data: ApiCategory[] }) => response.data,
    }),
  }),
})
