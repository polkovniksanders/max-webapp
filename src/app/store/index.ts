import { configureStore } from '@reduxjs/toolkit'
import { productReducer, productsApi } from '@entities/product'
import { cartReducer } from '@entities/cart'
import { shopReducer, shopApi } from '@entities/shop'
import { categoriesApi } from '@entities/category'

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    shop: shopReducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      categoriesApi.middleware,
      productsApi.middleware,
      shopApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
