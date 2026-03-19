import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import { shopReducer } from '@entities/shop'
import { cartReducer } from '@entities/cart'
import { orderReducer } from '@entities/order'
import { productFiltersReducer } from '@features/product-filters'
import { baseApi } from '@shared/api'

export const store = configureStore({
  reducer: {
    shop: shopReducer,
    cart: cartReducer,
    order: orderReducer,
    productFilters: productFiltersReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

// Enables refetchOnFocus / refetchOnReconnect for the whole app
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector