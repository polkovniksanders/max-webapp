export type { Shop } from './model/types'
export { default as shopReducer } from './model/shopSlice'
export type { ApiShop, ApiShopLegalInfo, ApiShopDocument, ShopStyle } from './model/apiTypes'
export {
  useGetShopQuery,
  shopApiSlice,
} from './model/shopApi'
export { useShopStyle } from './model/useShopStyle'