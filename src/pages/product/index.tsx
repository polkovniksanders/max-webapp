import { ProductPage } from './ui/ProductPage'
import { ROUTES } from '@shared/config/routes'

export { ProductPage }
export const route = { path: ROUTES.PRODUCT, element: <ProductPage /> }
