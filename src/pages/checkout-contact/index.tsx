import { CheckoutContactPage } from './ui/CheckoutContactPage'
import { ROUTES } from '@shared/config/routes'

export { CheckoutContactPage }

export const route = {
  path: ROUTES.CHECKOUT_CONTACT,
  element: <CheckoutContactPage />,
}
