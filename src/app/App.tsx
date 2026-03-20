import { useEffect } from 'react'
import { HashRouter, useLocation } from 'react-router-dom'
import { Provider, useDispatch } from 'react-redux'
import { Toaster } from 'sonner'
import { store } from './store'
import { notifyReady } from '@shared/bridge'
import { useShopStyle } from '@entities/shop'
import { useLazyReadCartQuery, hydrateCart } from '@entities/cart'
import type { CartItem } from '@entities/cart'
import { Navbar } from '@widgets/navbar'
import { ModalProvider } from '@shared/ui'
import { AppRouter } from './router'
import { getShopId } from '@shared/config/shopId'
import { getMessengerUserId } from '@shared/config/userId'
import './styles/index.css'

const ROUTES_WITHOUT_NAVBAR = [
  '/checkout/contact',
  '/checkout/delivery',
  '/checkout/payment',
  '/checkout/pending',
  '/checkout/status',
]

const AppContent = () => {
  useShopStyle()

  const dispatch = useDispatch()
  const [fetchCart] = useLazyReadCartQuery()
  const { pathname } = useLocation()
  const showNavbar = !ROUTES_WITHOUT_NAVBAR.some((r) => pathname.startsWith(r))

  useEffect(() => {
    const userId = getMessengerUserId()
    fetchCart({ shop_id: getShopId(), messenger_user_id: userId }).then((result) => {
      if (result.data && result.data.length > 0) {
        const items: CartItem[] = result.data.map((apiItem) => ({
          productId: apiItem.product_id,
          title: apiItem.product.title,
          price: apiItem.product.price,
          old_price: apiItem.product.old_price ?? null,
          imageFile: apiItem.product.images?.[0]?.file ?? null,
          quantity: apiItem.quantity,
          cartItemId: apiItem.id,
          buyable: apiItem.product.buyable,
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
      {showNavbar && <Navbar />}
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
        <ModalProvider>
          <AppContent />
          <Toaster position="top-center" richColors closeButton />
        </ModalProvider>
      </HashRouter>
    </Provider>
  )
}
