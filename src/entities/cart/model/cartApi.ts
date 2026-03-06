import { baseApi } from '@shared/api'

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
  telegram_user_id: number
}

interface CartUpdateDTO {
  telegram_user_id: number
  shop_id: number
  product_id: number
  quantity: number
}

interface CartDeleteDTO {
  id: number
  telegram_user_id: number
  shop_id: number
}

export const { useLazyReadCartQuery, useUpdateCartMutation, useDeleteCartMutation } =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      readCart: builder.query<CartApiItem[], { shop_id: number; telegram_id: number }>({
        query: ({ shop_id, telegram_id }) =>
          `market/card/list?shop_id=${shop_id}&telegram_id=${telegram_id}`,
        transformResponse: (response: { data: CartApiItem[] }) => response.data ?? [],
      }),
      updateCart: builder.mutation<void, CartUpdateDTO>({
        query: (body) => ({
          url: 'market/card/update',
          method: 'POST',
          body,
        }),
      }),
      deleteCart: builder.mutation<void, CartDeleteDTO>({
        query: (body) => ({
          url: 'market/card/delete',
          method: 'DELETE',
          body,
        }),
      }),
    }),
  })
