export { default as orderReducer } from './model/orderSlice'
export type { ApiOrder, ApiOrderItem } from './model/orderApi'
export {
  useGetOrdersHistoryQuery,
  useGetOrderQuery,
  useBuyProductMutation,
} from './model/orderApi'
