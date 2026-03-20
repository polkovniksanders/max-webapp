import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/config/routes'
import styles from './CheckoutPaymentPage.module.css'

const PAYMENT_URL_KEY = 'checkout_payment_url'
const ORDER_ID_KEY = 'checkout_order_id'

/**
 * Iframe-based payment page for yookassa and cloudpayment providers.
 *
 * The payment URL and orderId are stored in sessionStorage by CheckoutDeliveryPage
 * immediately before navigating here.
 *
 * Flow:
 * - Renders the provider's payment page inside a fullscreen iframe.
 * - "Я оплатил" button navigates to the pending page where we poll for confirmation.
 * - If sessionStorage data is missing (direct navigation / stale session) we
 *   redirect back to the cart so the user can restart checkout.
 */
export const CheckoutPaymentPage = () => {
  const navigate = useNavigate()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const paymentUrl = sessionStorage.getItem(PAYMENT_URL_KEY)
  const rawOrderId = sessionStorage.getItem(ORDER_ID_KEY)
  const orderId = rawOrderId ? Number(rawOrderId) : null

  useEffect(() => {
    if (!paymentUrl || !orderId) {
      navigate(ROUTES.CART, { replace: true })
    }
  }, [paymentUrl, orderId, navigate])

  const handlePaid = () => {
    sessionStorage.removeItem(PAYMENT_URL_KEY)
    sessionStorage.removeItem(ORDER_ID_KEY)
    navigate(ROUTES.CHECKOUT_PENDING.replace(':orderId', String(orderId)), { replace: true })
  }

  if (!paymentUrl || !orderId) return null

  return (
    <div className={styles.page}>
      <iframe
        ref={iframeRef}
        src={paymentUrl}
        className={styles.iframe}
        title="Оплата заказа"
        allow="payment"
      />

      <div className={styles.bottomBar}>
        <button className={styles.paidBtn} onClick={handlePaid}>
          Я оплатил
        </button>
      </div>
    </div>
  )
}