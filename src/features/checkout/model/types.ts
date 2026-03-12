/**
 * Possible input types for a dynamic checkout form field.
 */
export type CheckoutFieldType = 'text' | 'number' | 'textarea' | 'select'

/**
 * Validation rules for a single checkout field.
 * All properties are optional — only provided rules are enforced.
 */
export interface CheckoutFieldValidation {
  /** Whether the field must be filled in before submitting. */
  required?: boolean
  /** Minimum string length (applies to text/textarea fields). */
  minLength?: number
  /** Maximum string length (applies to text/textarea fields). */
  maxLength?: number
  /** Minimum numeric value (applies to number fields). */
  min?: number
  /** Maximum numeric value (applies to number fields). */
  max?: number
  /** Regex pattern the value must match. */
  pattern?: string
  /** Whether the field must be a valid email address. */
  email?: boolean
}

/**
 * Descriptor for a single dynamic form field rendered on the checkout delivery page.
 */
export interface CheckoutField {
  /** Unique field name used as the form key. */
  name: string
  /** Human-readable label displayed above the field. */
  label: string
  /** Input type that determines which HTML element is rendered. */
  type: CheckoutFieldType
  /** Placeholder text shown inside the empty field. */
  placeholder?: string
  /** Option strings for `select` fields. */
  options?: string[]
  /** Validation rules applied via Zod. */
  validation?: CheckoutFieldValidation
}

/**
 * Configuration for the checkout delivery page, including its title and field list.
 */
export interface CheckoutPageConfig {
  /** Optional page heading displayed at the top of the form. */
  title?: string
  /** Ordered list of fields to render. */
  fields: CheckoutField[]
}

/**
 * Top-level checkout form configuration stored in `shop.details.checkout_config`.
 */
export interface CheckoutFormConfig {
  checkoutPage: CheckoutPageConfig
}