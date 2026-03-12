import { z } from 'zod'
import type { CheckoutFormConfig } from './types'

/**
 * Builds a Zod validation schema dynamically from a server-provided checkout config.
 *
 * Each field in `config.checkoutPage.fields` is converted to the appropriate
 * Zod type (`z.coerce.number` for numeric fields, `z.string` for all others)
 * and the configured validation rules are applied in order.
 *
 * @param config - The checkout form configuration from the shop API (or mock).
 * @returns A `z.ZodObject` schema whose shape mirrors the dynamic field names.
 *
 * @example
 * const schema = buildDynamicSchema(MOCK_CHECKOUT_CONFIG)
 * const result = schema.safeParse({ address: 'Main St 1', deliveryType: 'Курьер' })
 */
export function buildDynamicSchema(config: CheckoutFormConfig): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of config.checkoutPage.fields) {
    const v = field.validation ?? {}

    if (field.type === 'number') {
      // Use coerce so HTML <input type="number"> string values are auto-cast.
      let schema: z.ZodNumber = z.coerce.number({ error: 'Введите число' })
      if (v.min !== undefined) schema = schema.min(v.min, `Минимум ${v.min}`)
      if (v.max !== undefined) schema = schema.max(v.max, `Максимум ${v.max}`)
      shape[field.name] = v.required ? schema : schema.optional()
    } else {
      let schema: z.ZodString = z.string()
      if (v.email) schema = schema.email('Некорректный email')
      if (v.pattern) schema = schema.regex(new RegExp(v.pattern), 'Некорректный формат')
      if (v.minLength !== undefined) schema = schema.min(v.minLength, `Минимум ${v.minLength} символов`)
      if (v.maxLength !== undefined) schema = schema.max(v.maxLength, `Максимум ${v.maxLength} символов`)
      // Enforce non-empty string for required text/textarea/select fields.
      if (v.required) schema = schema.min(1, 'Обязательное поле')
      shape[field.name] = v.required ? schema : schema.optional()
    }
  }

  return z.object(shape)
}
