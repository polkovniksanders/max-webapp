import { baseApi } from '@shared/api'
import { API_ENDPOINTS } from '@shared/api/endpoints'
import { getMessengerUserId } from '@shared/config/userId'
import type { ApiShop } from './apiTypes'

export interface ApiShopVisitor {
  [key: string]: unknown
}

export const shopApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShop: builder.query<ApiShop, number>({
      query: (shopId) => `shops/${shopId}`,
      transformResponse: (response: { data: ApiShop }) => response.data,
      keepUnusedDataFor: 3600, // shop config changes very rarely
    }),

    visitShop: builder.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.SHOP_VISIT,
        method: 'POST',
      }),
    }),

    getShopVisitor: builder.query<ApiShopVisitor, void>({
      query: () => API_ENDPOINTS.SHOP_VISITOR,
      transformResponse: (response: { data: ApiShopVisitor }) => response.data,
    }),

    addShopVisitor: builder.mutation<void, number>({
      query: (shopId) => ({
        url: API_ENDPOINTS.SHOP_VISITORS(shopId),
        method: 'POST',
        body: { messenger_user_id: getMessengerUserId() },
      }),
    }),
  }),
})

export const {
  useGetShopQuery,
  useVisitShopMutation,
  useGetShopVisitorQuery,
  useAddShopVisitorMutation,
} = shopApiSlice