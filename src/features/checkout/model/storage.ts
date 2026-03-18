const CONTACT_KEY = 'checkout_contact'
const DELIVERY_KEY = 'checkout_delivery'

/**
 * Data collected on the checkout contact step (phone + oferta consent).
 */
export interface ContactFormData {
  /** Phone number in masked format, e.g. "+7 (999) 123-45-67". */
  phone: string
  /** Whether the user has accepted the oferta terms. */
  ofertaAccepted: boolean
}

/**
 * Persist contact form data to sessionStorage so it survives same-session
 * navigation (e.g. going back from the delivery step).
 *
 * @param data - The contact form values to persist.
 */
export function saveContactData(data: ContactFormData): void {
  sessionStorage.setItem(CONTACT_KEY, JSON.stringify(data))
}

/**
 * Load previously saved contact form data from sessionStorage.
 * Returns an empty object if nothing is stored or parsing fails.
 *
 * @returns Partial contact form data (fields may be missing if not yet saved).
 */
export function loadContactData(): Partial<ContactFormData> {
  try {
    const raw = sessionStorage.getItem(CONTACT_KEY)
    return raw ? (JSON.parse(raw) as Partial<ContactFormData>) : {}
  } catch {
    return {}
  }
}

/**
 * Persist dynamic delivery form data to sessionStorage.
 * Shape is a free-form record because it is driven by the server-side config.
 *
 * @param data - Key-value map of all delivery field values.
 */
export function saveDeliveryData(data: Record<string, unknown>): void {
  sessionStorage.setItem(DELIVERY_KEY, JSON.stringify(data))
}

/**
 * Load previously saved delivery form data from sessionStorage.
 * Returns an empty object if nothing is stored or parsing fails.
 *
 * @returns Key-value map of delivery field values, may be empty.
 */
export function loadDeliveryData(): Record<string, unknown> {
  try {
    const raw = sessionStorage.getItem(DELIVERY_KEY)
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

/**
 * Removes all checkout-related data from sessionStorage.
 * Call this after a successful order submission to prevent stale data
 * from pre-filling the form in subsequent sessions.
 */
export function clearCheckoutData(): void {
  sessionStorage.removeItem(CONTACT_KEY)
  sessionStorage.removeItem(DELIVERY_KEY)
}
