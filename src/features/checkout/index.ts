export type {
  CheckoutFormConfig,
  CheckoutField,
  CheckoutFieldType,
  CheckoutFieldValidation,
  CheckoutPageConfig,
} from './model/types'

export {
  saveContactData,
  loadContactData,
  saveDeliveryData,
  loadDeliveryData,
} from './model/storage'
export type { ContactFormData } from './model/storage'

export { buildDynamicSchema } from './model/buildDynamicSchema'

export { MOCK_CHECKOUT_CONFIG } from './model/mockConfig'
