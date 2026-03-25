import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader } from '@shared/ui'
import { toast } from '@shared/lib'
import { useBackButton } from '@shared/hooks/useBackButton'
import { ROUTES } from '@shared/config/routes'
import { useGetShopQuery } from '@entities/shop'
import { getShopId } from '@shared/config/shopId'
import { getMessengerUserId } from '@shared/config/userId'
import { getWebApp } from '@shared/bridge'
import { useBuyProductMutation, useCreateOrderMutation } from '@entities/order'
import { clearCart } from '@entities/cart'
import { useAppSelector, useAppDispatch } from '@app/store'
import {
  buildDynamicSchema,
  loadContactData,
  loadDeliveryData,
  saveDeliveryData,
  clearCheckoutData,
  DEFAULT_CHECKOUT_CONFIG,
} from '@features/checkout'
import type { CheckoutFormConfig, CheckoutField } from '@features/checkout'
import styles from './CheckoutDeliveryPage.module.css'

/** Resolves the checkout form config: parses `shop.details.checkout_config` or falls back to default. */
function resolveConfig(checkoutConfigRaw?: string | null): CheckoutFormConfig {
  if (checkoutConfigRaw) {
    try {
      return JSON.parse(checkoutConfigRaw) as CheckoutFormConfig
    } catch {
      // JSON parse failure — fall through to default
    }
  }
  return DEFAULT_CHECKOUT_CONFIG
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

      {(field.type === 'text' || field.type === 'email' || field.type === 'number') && (
        <input
          id={field.name}
          type={field.type}
          inputMode={field.type === 'email' ? 'email' : undefined}
          autoComplete={field.type === 'email' ? 'email' : undefined}
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
 * Flow:
 * 1. Reads `checkout_config` from shop API; falls back to `DEFAULT_CHECKOUT_CONFIG`.
 * 2. Builds a Zod schema dynamically via `buildDynamicSchema`.
 * 3. Restores previously entered delivery data from sessionStorage.
 * 4. On submit, calls `max/market/product/buy` with the full order payload:
 *    - Contact data (phone) from sessionStorage (step 1)
 *    - Cart items from Redux store
 *    - Dynamic delivery fields from the form
 *    - User identity from the MAX Bridge
 * 5. On success: clears cart + sessionStorage, navigates to `/checkout/success`.
 * 6. On error: shows an alert with the server message.
 */
export const CheckoutDeliveryPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useBackButton()

  const { data: shop } = useGetShopQuery(getShopId())

  // Derive checkout config — memoised so schema/defaultValues are stable.
  const config = useMemo(
    () => resolveConfig(shop?.details?.checkout_config),
    [shop?.details?.checkout_config]
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

  // Select cart items from Redux — used to build `product_id_list`.
  const cartItems = useAppSelector((state) => state.cart.items)

  const [buyProduct, { isLoading: isBuyingPaid }] = useBuyProductMutation()
  const [createOrder, { isLoading: isBuyingFree }] = useCreateOrderMutation()
  const isBuying = isBuyingPaid || isBuyingFree

  // True when at least one cart item requires a payment system.
  // Sourced from CartItem.buyable which is synced from the cart API after each add().
  const isBuyable = cartItems.some((item) => item.buyable === true)

  /**
   * Assembles the full order payload and submits to the API.
   *
   * After a successful response the flow branches:
   *   - isBuyable + redirect URL:
   *       yookassa / cloudpayment → iframe payment page
   *       unknown provider        → external browser (window.location)
   *   - isBuyable + no redirect  → pending page (polls until confirmed)
   *   - not isBuyable            → status page (free order)
   *
   * Phone is stripped to digits only to satisfy the backend's ValidPhoneRule.
   * MAX Bridge user fields (first_name, last_name, username) are forwarded
   * so the backend can create/update the user record.
   * Dynamic delivery fields are spread in as-is — the server validates them
   * against the shop-specific rules.
   */
  const onSubmit = async (data: Record<string, unknown>) => {
    // Persist delivery data so the form can be restored if navigation occurs.
    saveDeliveryData(data)

    const contactData = loadContactData()

    if (!contactData.phone) {
      toast.error('Не удалось загрузить контактные данные. Вернитесь на шаг 1.')
      return
    }

    // Strip formatting mask — backend expects digits only.
    const phoneDigits = contactData.phone.replace(/\D/g, '')

    // Collect productId values for every item currently in the cart.
    const productIdList = cartItems.map((item) => item.productId)

    // Forward MAX Bridge user identity so the server can track the buyer.
    const bridgeUser = getWebApp()?.initDataUnsafe?.user

    const payload = {
      messenger_user_id: getMessengerUserId(),
      shop_id: getShopId(),
      phone: phoneDigits,
      product_id_list: productIdList,
      first_name: bridgeUser?.first_name,
      last_name: bridgeUser?.last_name,
      username: bridgeUser?.username,
      delivery_type: 2,
      ...data,
    }

    try {
      if (isBuyable) {
        // ── Paid flow: buyable items → POST /max/market/product/buy ──────────
        const result = await buyProduct(payload).unwrap()

        dispatch(clearCart())
        clearCheckoutData()

        const orderId = result.order_id
        const redirectURL = result.redirect

        if (redirectURL) {
          if (redirectURL.includes('yookassa') || redirectURL.includes('cloudpayment')) {
            sessionStorage.setItem('checkout_payment_url', redirectURL)
            sessionStorage.setItem('checkout_order_id', String(orderId))
            navigate(ROUTES.CHECKOUT_PAYMENT, { replace: true })
            return
          }
          // Unknown payment provider — open in the system browser.
          window.location.href = redirectURL
          return
        }

        // No redirect yet — poll until payment is confirmed.
        navigate(ROUTES.CHECKOUT_PENDING.replace(':orderId', String(orderId)), { replace: true })
      } else {
        // ── Free flow: all items non-buyable → POST /market/product/order/create ──
        const result = await createOrder(payload).unwrap()

        dispatch(clearCart())
        clearCheckoutData()

        const orderId = result.order_id
        navigate(ROUTES.CHECKOUT_STATUS.replace(':orderId', String(orderId ?? '')), {
          replace: true,
        })
      }
    } catch (err) {
      // Surface the server error message when available; fallback to generic text.
      const message =
        err != null &&
        typeof err === 'object' &&
        'data' in err &&
        err.data != null &&
        typeof err.data === 'object' &&
        'message' in err.data
          ? String((err.data as { message: string }).message)
          : 'Не удалось оформить заказ. Попробуйте ещё раз.'

      toast.error(message)
    }
  }

  const isDisabled = isSubmitting || isBuying

  return (
    <div className={styles.page}>
      <PageHeader title={config.checkoutPage.title ?? 'Доставка'} />

      <form id="delivery-form" className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        {config.checkoutPage.fields.map((field) => (
          <DynamicField
            key={field.name}
            field={field}
            register={register}
            error={errors[field.name]?.message ? String(errors[field.name]!.message) : undefined}
          />
        ))}
      </form>

      <div className={styles.bottomBar}>
        <button
          type="submit"
          form="delivery-form"
          disabled={isDisabled}
          className={styles.submitBtn}
        >
          {isBuying ? 'Оформляем...' : 'Оформить заказ'}
        </button>
      </div>
    </div>
  )
}
