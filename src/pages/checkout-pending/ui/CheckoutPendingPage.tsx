import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader } from 'lucide-react'
import { ROUTES } from '@shared/config/routes'
import { useGetOrderQuery } from '@entities/order'
import styles from './CheckoutPendingPage.module.css'

/** Order statuses that indicate payment was received and order is confirmed. */
const PAID_STATUSES = new Set(['paid', 'completed', 'confirmed', 'done', 'success', 'delivered', 'shipped'])

/**
 * Polling page shown after a paid checkout when no immediate redirect was available.
 *
 * Polls GET /max/market/show/order/:id every 5 seconds.
 * Navigates to the status page automatically once the order reaches a paid status.
 * Also provides a manual "Перейти к заказу" button so the user is never stuck.
 */
export const CheckoutPendingPage = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  const id = Number(orderId)
  const statusPath = ROUTES.CHECKOUT_STATUS.replace(':orderId', String(id))

  const { data: order } = useGetOrderQuery(id, {
    skip: !id,
    pollingInterval: 5000,
  })

  useEffect(() => {
    if (order && PAID_STATUSES.has(order.status.toLowerCase())) {
      navigate(statusPath, { replace: true })
    }
  }, [order, navigate, statusPath])

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.spinnerWrap}>
          <Loader size={40} className={styles.spinner} />
        </div>

        <p className={styles.title}>Ожидаем оплату</p>
        <p className={styles.subtitle}>
          Страница обновится автоматически после подтверждения платежа
        </p>

        {id > 0 && (
          <p className={styles.orderId}>Заказ #{id}</p>
        )}

        <button
          className={styles.manualBtn}
          onClick={() => navigate(statusPath, { replace: true })}
        >
          Перейти к заказу
        </button>
      </div>
    </div>
  )
}