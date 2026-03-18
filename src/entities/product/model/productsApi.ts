import { baseApi } from '@shared/api'
import { API_ENDPOINTS } from '@shared/api/endpoints'
import { getMessengerUserId } from '@shared/config/userId'
import { getShopId } from '@shared/config/shopId'
import type { ApiProduct, ApiProductDetail } from './apiTypes'

export const {
  useLazyGetCategoryProductsQuery,
  useGetProductQuery,
  useVisitProductMutation,
  useLazyGetProductHistoryQuery,
} = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryProducts: builder.query<ApiProduct[], number>({
      query: (categoryId) =>
        `categories/${categoryId}/products?category_id=${categoryId}&id=${getShopId()}&limit=4&offset=0&status[]=2&title=&unique_by_group=false`,
      transformResponse: (response: { data: ApiProduct[] }) => response.data ?? [],
    }),

    getProduct: builder.query<ApiProductDetail, number>({
      query: (id) => {
        const messengerId = getMessengerUserId()
        const params = messengerId ? `?messenger_user_id=${messengerId}` : ''
        return `${API_ENDPOINTS.PUBLIC_PRODUCT(id)}${params}`
      },
      transformResponse: (response: { data: ApiProductDetail }) => response.data,
      keepUnusedDataFor: 300,
    }),

    visitProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: API_ENDPOINTS.PRODUCT_VISIT(id),
        method: 'POST',
      }),
    }),

    getProductHistory: builder.query<ApiProduct[], number>({
      query: (shopId) => API_ENDPOINTS.PRODUCT_HISTORY(shopId),
      transformResponse: (response: { data: ApiProduct[] }) => response.data ?? [],
    }),
  }),
})