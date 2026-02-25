import { configureStore } from '@reduxjs/toolkit'
import { productReducer } from '@entities/product'
import { cartReducer } from '@entities/cart'
import { shopReducer } from '@entities/shop'

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    shop: shopReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
