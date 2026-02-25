export type { Shop } from './model/types'
export { default as shopReducer } from './model/shopSlice'
export type { ApiShop, ApiShopLegalInfo, ApiShopDocument } from './model/apiTypes'
export { shopApi, useGetShopQuery } from './model/shopApi'
