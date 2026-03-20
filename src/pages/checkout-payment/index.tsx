 import { CheckoutPaymentPage } from './ui/CheckoutPaymentPage'
import { ROUTES } from '@shared/config/routes'

export { CheckoutPaymentPage }

export const route = {
  path: ROUTES.CHECKOUT_PAYMENT,
  element: <CheckoutPaymentPage />,
}