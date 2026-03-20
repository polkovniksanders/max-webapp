import { CheckoutStatusPage } from './ui/CheckoutStatusPage'
import { ROUTES } from '@shared/config/routes'

export { CheckoutStatusPage }

export const route = {
  path: ROUTES.CHECKOUT_STATUS,
  element: <CheckoutStatusPage />,
}