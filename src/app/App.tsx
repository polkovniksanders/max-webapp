import { useEffect } from 'react'
import { HashRouter } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store'
import { notifyReady } from '@shared/bridge'
import { useShopStyle } from '@entities/shop'
import { useLazyReadCartQuery, hydrateCart } from '@entities/cart'
import type { CartItem } from '@entities/cart'
import { Navbar } from '@widgets/navbar'
import { AppRouter } from './router'
import { getShopId } from '@shared/config/shopId'
import './styles/index.css'

const TELEGRAM_USER_ID = 5492444

const AppContent = () => {
  useShopStyle()

  const dispatch = useDispatch()
  const [fetchCart] = useLazyReadCartQuery()

  useEffect(() => {
    fetchCart({ shop_id: getShopId(), telegram_id: TELEGRAM_USER_ID }).then((result) => {
      if (result.data && result.data.length > 0) {
        const items: CartItem[] = result.data.map((apiItem) => ({
          productId: apiItem.product_id,
          title: apiItem.product.title,
          price: apiItem.product.price,
          old_price: apiItem.product.old_price ?? null,
          imageFile: apiItem.product.images?.[0]?.file ?? null,
          quantity: apiItem.quantity,
          cartItemId: apiItem.id,
        }))
        dispatch(hydrateCart(items))
      }
    })
  }, [])

  return (
    <>
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <AppRouter />
      </main>
      <Navbar />
    </>
  )
}

export const App = () => {
  useEffect(() => {
    notifyReady()
  }, [])

  return (
    <Provider store={store}>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </Provider>
  )
}
