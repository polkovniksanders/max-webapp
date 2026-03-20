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
  messenger_user_id: number
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

/**
 * Response from `max/market/product/buy` (paid flow).
 *
 * - `order_id` — always present; identifies the created order.
 * - `redirect` — present when the shop/product requires payment.
 *   Contains the full payment provider URL (yookassa, cloudpayment, etc.).
 */
export interface BuyProductResponse {
  order_id: number
  redirect?: string | null
}

/**
 * Payload for the `market/product/order/create` endpoint (free flow).
 *
 * Used when none of the cart items have `buyable = true`.
 * Shape mirrors BuyProductDTO — dynamic delivery fields are spread in via index signature.
 */
export interface CreateOrderDTO {
  messenger_user_id: number
  shop_id: number
  product_id_list: number[]
  phone: string
  full_name?: string
  [key: string]: unknown
}

/** Response from `market/product/order/create`. */
export interface CreateOrderResponse {
  order_id?: number
  redirect?: string | null
}

export const {
  useGetOrdersHistoryQuery,
  useGetOrderQuery,
  useBuyProductMutation,
  useCreateOrderMutation,
} = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrdersHistory: builder.query<ApiOrder[], void>({
      query: () => API_ENDPOINTS.ORDERS_HISTORY(getShopId()),
      transformResponse: (response: { data: ApiOrder[] }) => response.data ?? [],
      keepUnusedDataFor: 300,
    }),

    getOrder: builder.query<ApiOrder, number>({
      query: (id) => API_ENDPOINTS.ORDER_SHOW(id),
      transformResponse: (response: { data: ApiOrder }) => response.data,
      keepUnusedDataFor: 0, // always fetch fresh — status changes over time
    }),

    /** Paid flow — cart contains at least one buyable product. */
    buyProduct: builder.mutation<BuyProductResponse, BuyProductDTO>({
      query: (body) => ({
        url: API_ENDPOINTS.PRODUCT_BUY,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: BuyProductResponse }) => response.data,
    }),

    /** Free flow — all cart items have buyable = false. */
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderDTO>({
      query: (body) => ({
        url: API_ENDPOINTS.ORDER_CREATE,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: CreateOrderResponse }) => response.data,
    }),
  }),
})