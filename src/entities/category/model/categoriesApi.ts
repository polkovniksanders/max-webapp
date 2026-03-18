import { baseApi } from '@shared/api'
import { API_ENDPOINTS } from '@shared/api/endpoints'
import { getMessengerUserId } from '@shared/config/userId'
import { getShopId } from '@shared/config/shopId'
import type { ApiCategory } from './types'

export const { useGetCategoriesQuery } = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ApiCategory[], void>({
      query: () => {
        const shopId = getShopId()
        const messengerId = getMessengerUserId()
        const params = new URLSearchParams({ has_products: '1', shop_id: String(shopId) })
        if (messengerId) params.set('messenger_user_id', String(messengerId))
        return `${API_ENDPOINTS.PRODUCTS_CATEGORY}?${params}`
      },
      transformResponse: (response: { data: ApiCategory[] }) => response.data,
    }),
  }),
})