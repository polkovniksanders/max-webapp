import { baseApi } from '@shared/api'
import { API_ENDPOINTS } from '@shared/api/endpoints'
import { getMessengerUserId } from '@shared/config/userId'
import { getShopId } from '@shared/config/shopId'
import type { ApiProduct, ApiProductDetail } from './apiTypes'

/** Sort field options supported by the backend */
export type ProductSortBy = 'price' | 'title' | 'id'

/** Sort direction supported by the backend */
export type SortDirection = 'asc' | 'desc'

/** Parameters for the cross-shop product search endpoint */
export interface SearchProductsParams {
  /** Free-text search query — filters by product title */
  title?: string
  /** Sort field (e.g. 'price') */
  sort_by?: ProductSortBy
  /** Sort direction */
  sort_direction?: SortDirection
  /** Pagination offset */
  offset?: number
  /** Page size */
  limit?: number
}

export const {
  useLazyGetCategoryProductsQuery,
  useGetCategoryProductsQuery,
  useGetProductQuery,
  useLazyGetProductHistoryQuery,
  useSearchProductsQuery,
} = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryProducts: builder.query<ApiProduct[], number>({
      query: (categoryId) =>
        `categories/${categoryId}/products?category_id=${categoryId}&id=${getShopId()}&limit=4&offset=0&status[]=2&title=&unique_by_group=false`,
      transformResponse: (response: { data: ApiProduct[] }) => response.data ?? [],
      keepUnusedDataFor: 600, // product lists refreshed every 10 min
    }),

    getCategoryProductsFull: builder.query<ApiProduct[], number>({
      query: (categoryId) =>
        `categories/${categoryId}/products?category_id=${categoryId}&id=${getShopId()}&limit=100&offset=0&status[]=2&title=&unique_by_group=false`,
      transformResponse: (response: { data: ApiProduct[] }) => response.data ?? [],
      keepUnusedDataFor: 600,
    }),

    /**
     * Search products across the whole shop with optional text query,
     * price sort, and pagination.
     *
     * Endpoint: GET public/products/{shopId}
     * Backend reference: spodialtelegramapp — readProducts endpoint in product.api.ts
     */
    searchProducts: builder.query<ApiProduct[], SearchProductsParams>({
      query: (params) => {
        const shopId = getShopId()
        const messengerId = getMessengerUserId()

        const qs = new URLSearchParams()
        qs.set('status[]', '2')
        qs.set('limit', String(params.limit ?? 20))
        qs.set('offset', String(params.offset ?? 0))

        if (params.title) qs.set('title', params.title)
        if (params.sort_by) qs.set('sort_by', params.sort_by)
        if (params.sort_direction) qs.set('sort_direction', params.sort_direction)
        if (messengerId) qs.set('messenger_user_id', String(messengerId))

        return `max/public/products/${shopId}?${qs.toString()}`
      },
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

    getProductHistory: builder.query<ApiProduct[], number>({
      query: (shopId) => API_ENDPOINTS.PRODUCT_HISTORY(shopId),
      transformResponse: (response: { data: ApiProduct[] }) => response.data ?? [],
    }),
  }),
})