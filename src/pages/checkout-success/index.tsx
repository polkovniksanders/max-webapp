import { OrderSuccessPage } from './ui/OrderSuccessPage'
import { ROUTES } from '@shared/config/routes'

export { OrderSuccessPage }

export const route = {
  path: ROUTES.CHECKOUT_SUCCESS,
  element: <OrderSuccessPage />,
}
