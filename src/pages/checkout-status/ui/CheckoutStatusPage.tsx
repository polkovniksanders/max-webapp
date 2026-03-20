import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { ROUTES } from '@shared/config/routes'
import { useGetOrderQuery } from '@entities/order'
import styles from './CheckoutStatusPage.module.css'

const STATUS_LABELS: Record<string, string> = {
  new: 'Новый',
  pending: 'В обработке',
  paid: 'Оплачен',
  confirmed: 'Подтверждён',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  completed: 'Выполнен',
  done: 'Выполнен',
  cancelled: 'Отменён',
  canceled: 'Отменён',
}

const CANCELLED_STATUSES = new Set(['cancelled', 'canceled'])
const SUCCESS_STATUSES = new Set(['paid', 'confirmed', 'completed', 'done', 'delivered', 'shipped'])

function StatusIcon({ status }: { status: string }) {
  const s = status.toLowerCase()
  if (CANCELLED_STATUSES.has(s)) return <XCircle size={40} color="#e53e3e" strokeWidth={2} />
  if (SUCCESS_STATUSES.has(s)) return <CheckCircle size={40} color="#27ae60" strokeWidth={2} />
  return <Clock size={40} color="#f0a500" strokeWidth={2} />
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₽'
}

/**
 * Final checkout screen — shown after any completed checkout flow.
 *
 * Fetches order details from GET /max/market/show/order/:id.
 * Displays status icon, order items, and total.
 * Used as the destination for both the free flow and the paid flow
 * (after payment iframe or pending polling confirms payment).
 */
export const CheckoutStatusPage = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  const id = Number(orderId)
  const { data: order, isLoading, isError } = useGetOrderQuery(id, { skip: !id })

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <p className={styles.loadingText}>Загружаем информацию о заказе...</p>
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className={styles.centerPage}>
        <p className={styles.errorText}>Не удалось загрузить заказ</p>
        <button className={styles.homeBtn} onClick={() => navigate(ROUTES.MAIN, { replace: true })}>
          На главную
        </button>
      </div>
    )
  }

  const statusLabel = STATUS_LABELS[order.status.toLowerCase()] ?? order.status

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <StatusIcon status={order.status} />
        </div>
        <p className={styles.title}>Заказ #{order.id}</p>
        <span className={styles.statusBadge} data-status={order.status.toLowerCase()}>
          {statusLabel}
        </span>
        <p className={styles.date}>{formatDate(order.created_at)}</p>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Состав заказа</p>
        <ul className={styles.itemList}>
          {order.items.map((item) => (
            <li key={item.id} className={styles.item}>
              <span className={styles.itemTitle}>{item.product_title}</span>
              <span className={styles.itemQty}>× {item.quantity}</span>
              <span className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.totalRow}>
        <span className={styles.totalLabel}>Итого</span>
        <span className={styles.totalAmount}>{formatPrice(order.total_price)}</span>
      </div>

      <div className={styles.bottomBar}>
        <button
          className={styles.homeBtn}
          onClick={() => navigate(ROUTES.MAIN, { replace: true })}
        >
          На главную
        </button>
      </div>
    </div>
  )
}