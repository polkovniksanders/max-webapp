export { default as orderReducer } from './model/orderSlice'
export type { ApiOrder, ApiOrderItem, BuyProductResponse, CreateOrderResponse } from './model/orderApi'
export {
  useGetOrdersHistoryQuery,
  useGetOrderQuery,
  useBuyProductMutation,
  useCreateOrderMutation,
} from './model/orderApi'
