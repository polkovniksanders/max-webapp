import { baseApi } from '@shared/api'
import { API_ENDPOINTS } from '@shared/api/endpoints'
import { getShopId } from '@shared/config/shopId'

export interface ApiOrderItem {
  id: number
  product_id: number
  product_title: string
  quantity: number
  price: number
}

export interface ApiOrder {
  id: number
  status: string
  total_price: number
  created_at: string
  items: ApiOrderItem[]
}

/**
 * Payload for the `max/market/product/buy` endpoint.
 *
 * Required fields are validated server-side by ApiBuyProductRequest.
 * All delivery/address fields from the dynamic checkout config are
 * forwarded as-is via the index signature.
 */
export interface BuyProductDTO {
  /** MAX / Telegram user ID of the buyer. */
  telegram_user_id: number
  /** Shop the order belongs to. */
  shop_id: number
  /** Ordered product IDs — one entry per cart item. */
  product_id_list: number[]
  /** Buyer phone digits only, e.g. "79161234567". */
  phone: string
  /** Buyer full name. */
  full_name?: string
  /** Additional dynamic delivery fields from checkout_config. */
  [key: string]: unknown
}


export const {
  useGetOrdersHistoryQuery,
  useGetOrderQuery,
  useBuyProductMutation,
} = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrdersHistory: builder.query<ApiOrder[], void>({
      query: () => API_ENDPOINTS.ORDERS_HISTORY(getShopId()),
      transformResponse: (response: { data: ApiOrder[] }) => response.data ?? [],
      keepUnusedDataFor: 300, // order list: refresh every 5 min
    }),

    getOrder: builder.query<ApiOrder, number>({
      query: (id) => API_ENDPOINTS.ORDER_SHOW(id),
      transformResponse: (response: { data: ApiOrder }) => response.data,
      keepUnusedDataFor: 1800, // individual orders are immutable once placed
    }),

    buyProduct: builder.mutation<ApiOrder, BuyProductDTO>({
      query: (body) => ({
        url: API_ENDPOINTS.PRODUCT_BUY,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: ApiOrder }) => response.data,
    }),
  }),
})