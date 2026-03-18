import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import { shopReducer } from '@entities/shop'
import { cartReducer } from '@entities/cart'
import { userReducer } from '@entities/user'
import { orderReducer } from '@entities/order'
import { baseApi } from '@shared/api'

export const store = configureStore({
  reducer: {
    shop: shopReducer,
    cart: cartReducer,
    user: userReducer,
    order: orderReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector