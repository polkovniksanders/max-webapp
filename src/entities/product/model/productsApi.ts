import { baseApi } from '@shared/api'
import type { ApiProduct, ApiProductDetail } from './apiTypes'

const SHOP_ID = 12
const USER_TG_ID = 5492444

export const { useLazyGetCategoryProductsQuery, useGetProductQuery } = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryProducts: builder.query<ApiProduct[], number>({
      query: (categoryId) =>
        `categories/${categoryId}/products?category_id=${categoryId}&id=${SHOP_ID}&limit=4&offset=0&status[]=2&title=&unique_by_group=false&user_tg_id=${USER_TG_ID}`,
      transformResponse: (response: { data: ApiProduct[] }) => response.data ?? [],
    }),

    getProduct: builder.query<ApiProductDetail, number>({
      query: (id) => `public/product/${id}?id=${id}&telegram_id=${USER_TG_ID}`,
      transformResponse: (response: { data: ApiProductDetail }) => response.data,
      keepUnusedDataFor: 300,
    }),
  }),
})
