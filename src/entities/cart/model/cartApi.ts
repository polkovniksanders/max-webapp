import { baseApi } from '@shared/api'
import { API_ENDPOINTS } from '@shared/api/endpoints'

export interface CartApiProduct {
  id: number
  title: string
  price: number
  old_price: number | null
  images: Array<{ file: string | null }>
}

export interface CartApiItem {
  id: number
  product_id: number
  product: CartApiProduct
  quantity: number
  shop_id: number
  messenger_user_id: number
}

export interface CartApiPromocode {
  code: string
  discount: number
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
    }),
  }),
})