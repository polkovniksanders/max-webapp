import { baseApi } from '@shared/api'
import { API_ENDPOINTS } from '@shared/api/endpoints'

export interface CartApiProduct {
  id: number
  title: string
  price: number
  old_price: number | null
  images: Array<{ file: string | null }>
  buyable: boolean
}

export interface CartApiItem {
  id: number
  product_id: number
  product: CartApiProduct
  quantity: number
  shop_id: number
  messenger_user_id: number
}

/**
 * Promocode validation response from the backend.
 * `summ` is the total cart amount AFTER the discount is applied.
 * It is absent when the promo check call fails (use RTK error state instead).
 */
export interface CartApiPromocode {
  id: number
  code: string | null
  /** Discounted total amount. Present on success, absent on error. */
  summ?: number
  [key: string]: unknown
}

interface CartUpdateDTO {
  messenger_user_id: number
  shop_id: number
  product_id: number
  quantity: number
}

interface CartDeleteDTO {
  id: number
  messenger_user_id: number
  shop_id: number
}

export const {
  useLazyReadCartQuery,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useLazyGetCartPromocodeQuery,
} = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    readCart: builder.query<CartApiItem[], { shop_id: number; messenger_user_id: number }>({
      query: ({ shop_id, messenger_user_id }) =>
        `${API_ENDPOINTS.MARKET_CARD_LIST}?shop_id=${shop_id}&messenger_user_id=${messenger_user_id}`,
      transformResponse: (response: { data: CartApiItem[] }) => response.data ?? [],
      // Cart is managed by Redux (optimistic updates); don't cache the raw API response
      keepUnusedDataFor: 0,
    }),

    updateCart: builder.mutation<void, CartUpdateDTO>({
      query: (body) => ({
        url: API_ENDPOINTS.MARKET_CARD_UPDATE,
        method: 'POST',
        body,
      }),
    }),

    deleteCart: builder.mutation<void, CartDeleteDTO>({
      query: (body) => ({
        url: API_ENDPOINTS.MARKET_CARD_DELETE,
        method: 'DELETE',
        body,
      }),
    }),

    getCartPromocode: builder.query<CartApiPromocode, { code: string; shop_id: number }>({
      query: ({ code, shop_id }) =>
        `${API_ENDPOINTS.MARKET_CARD_PROMOCODE}?code=${code}&shop_id=${shop_id}`,
      transformResponse: (response: { data: CartApiPromocode }) => response.data,
      keepUnusedDataFor: 0, // always validate fresh — promos can expire
    }),
  }),
})