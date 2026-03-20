import { CheckoutPendingPage } from './ui/CheckoutPendingPage'
import { ROUTES } from '@shared/config/routes'

export { CheckoutPendingPage }

export const route = {
  path: ROUTES.CHECKOUT_PENDING,
  element: <CheckoutPendingPage />,
}