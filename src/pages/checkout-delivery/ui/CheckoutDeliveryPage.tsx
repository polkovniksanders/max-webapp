import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle } from 'lucide-react'
import { PageHeader } from '@shared/ui'
import { useBackButton } from '@shared/hooks/useBackButton'
import { ROUTES } from '@shared/config/routes'
import { useGetShopQuery } from '@entities/shop'
import { getShopId } from '@shared/config/shopId'
import {
  buildDynamicSchema,
  loadContactData,
  loadDeliveryData,
  saveDeliveryData,
  MOCK_CHECKOUT_CONFIG,
} from '@features/checkout'
import type { CheckoutFormConfig, CheckoutField } from '@features/checkout'
import styles from './CheckoutDeliveryPage.module.css'

/** Resolves the checkout form config: parses `shop.details.checkout_config` or falls back to mock. */
function resolveConfig(checkoutConfigRaw?: string | null): CheckoutFormConfig {
  if (checkoutConfigRaw) {
    try {
      return JSON.parse(checkoutConfigRaw) as CheckoutFormConfig
    } catch {
      // JSON parse failure — fall through to mock
    }
  }
  return MOCK_CHECKOUT_CONFIG
}

/**
 * Renders a single dynamic form field based on its `type` descriptor.
 *
 * @param field - Field descriptor from the checkout config.
 * @param register - react-hook-form register function.
 * @param error - Validation error message for this field, if any.
 */
function DynamicField({
  field,
  register,
  error,
}: {
  field: CheckoutField
  register: ReturnType<typeof useForm>['register']
  error?: string
}) {
  const inputClass = `${styles.input} ${error ? styles.inputError : ''}`

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={field.name}>
        {field.label}
        {field.validation?.required && <span className={styles.required}> *</span>}
      </label>

      {field.type === 'textarea' && (
        <textarea
          id={field.name}
          placeholder={field.placeholder}
          className={`${inputClass} ${styles.textarea}`}
          {...register(field.name)}
        />
      )}

      {field.type === 'select' && (
        <select
          id={field.name}
          className={`${inputClass} ${styles.select}`}
          {...register(field.name)}
          defaultValue=""
        >
          <option value="" disabled>
            Выберите...
          </option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {(field.type === 'text' || field.type === 'number') && (
        <input
          id={field.name}
          type={field.type}
          placeholder={field.placeholder}
          className={inputClass}
          {...register(field.name)}
        />
      )}

      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

/**
 * Step 2 of checkout: dynamic delivery form driven by server config.
 *
 * - Reads `checkout_config` from shop API; falls back to `MOCK_CHECKOUT_CONFIG`.
 * - Builds a Zod schema dynamically via `buildDynamicSchema`.
 * - Restores previously entered delivery data from sessionStorage.
 * - On submit, persists delivery data and displays a mock success screen.
 */
export const CheckoutDeliveryPage = () => {
  const navigate = useNavigate()
  useBackButton()

  const [isSubmitted, setIsSubmitted] = useState(false)

  const { data: shop } = useGetShopQuery(getShopId())

  // Derive checkout config — memoised so schema/defaultValues are stable.
  const config = useMemo(
    () => resolveConfig(shop?.details?.checkout_config),
    [shop?.details?.checkout_config],
  )

  const schema = useMemo(() => buildDynamicSchema(config), [config])

  const savedDelivery = useMemo(() => loadDeliveryData(), [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema),
    defaultValues: savedDelivery,
  })

  const onSubmit = (data: Record<string, unknown>) => {
    saveDeliveryData(data)
    const contactData = loadContactData()
    // TODO: send order to API — for now log and show success screen.
    console.log('Checkout data:', contactData, data)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className={`${styles.page} ${styles.successPage}`}>
        <div className={styles.successWrap}>
          <div className={styles.successIcon}>
            <CheckCircle size={36} color="#27ae60" strokeWidth={2} />
          </div>
          <p className={styles.successTitle}>Заказ оформлен!</p>
          <p className={styles.successText}>
            Мы свяжемся с вами в ближайшее время
          </p>
          <button
            className={styles.backToShopBtn}
            onClick={() => navigate(ROUTES.MAIN)}
          >
            Вернуться в магазин
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader title={config.checkoutPage.title ?? 'Доставка'} />

      <form
        id="delivery-form"
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {config.checkoutPage.fields.map((field) => (
          <DynamicField
            key={field.name}
            field={field}
            register={register}
            error={
              errors[field.name]?.message
                ? String(errors[field.name]!.message)
                : undefined
            }
          />
        ))}
      </form>

      <div className={styles.bottomBar}>
        <button
          type="submit"
          form="delivery-form"
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  )
}
