import { useNavigate } from 'react-router-dom'
import { useGetOrdersHistoryQuery } from '@entities/order'
import type { ApiOrder } from '@entities/order'
import { PageHeader, Spinner } from '@shared/ui'
import { useBackButton } from '@shared/hooks/useBackButton'
import { ROUTES } from '@shared/config/routes'
import styles from './OrdersPage.module.css'

/** Human-readable labels for order status slugs returned by the API. */
const STATUS_LABEL: Record<string, string> = {
  new: 'Новый',
  processing: 'В обработке',
  completed: 'Выполнен',
  cancelled: 'Отменён',
  paid: 'Оплачен',
}

/**
 * Builds the absolute path to an order-detail page for a given order id.
 *
 * @param id - The order's numeric id.
 * @returns Route string, e.g. `/orders/42`.
 */
function orderDetailPath(id: number): string {
  return ROUTES.ORDER_DETAIL.replace(':orderId', String(id))
}

/**
 * Compact order summary card shown in the orders history list.
 *
 * Clicking anywhere on the card navigates to the order-detail page.
 *
 * @param order - The order data to render.
 * @param onClick - Navigation callback supplied by the parent.
 */
const OrderCard = ({ order, onClick }: { order: ApiOrder; onClick: () => void }) => (
  <button className={styles.card} onClick={onClick} aria-label={`Заказ #${order.id}`}>
    <div className={styles.cardHeader}>
      <span className={styles.orderId}>Заказ #{order.id}</span>
      <span className={styles.status}>{STATUS_LABEL[order.status] ?? order.status}</span>
    </div>
    <div className={styles.items}>
      {order.items.map((item) => (
        <div key={item.id} className={styles.item}>
          <span className={styles.itemTitle}>{item.product_title}</span>
          <span className={styles.itemQty}>× {item.quantity}</span>
          <span className={styles.itemPrice}>
            {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
          </span>
        </div>
      ))}
    </div>
    <div className={styles.cardFooter}>
      <span className={styles.date}>
        {new Date(order.created_at).toLocaleDateString('ru-RU')}
      </span>
      <div className={styles.footerRight}>
        <span className={styles.total}>{order.total_price.toLocaleString('ru-RU')} ₽</span>
        <ChevronIcon />
      </div>
    </div>
  </button>
)

/** Small right-arrow icon indicating a tappable card. */
const ChevronIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: 'var(--color-text-secondary, #bbb)', flexShrink: 0 }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

/**
 * Orders history page — shows the full list of past orders for the current
 * user. Each card is tappable and navigates to the order-detail page.
 */
export const OrdersPage = () => {
  useBackButton()
  const navigate = useNavigate()

  const { data: orders, isLoading, isError, refetch } = useGetOrdersHistoryQuery()

  return (
    <div className={styles.page}>
      <PageHeader title="История заказов" />

      {isLoading && (
        <div className={styles.center}>
          <Spinner />
        </div>
      )}

      {isError && (
        <div className={styles.center}>
          <p className={styles.errorText}>Не удалось загрузить заказы</p>
          <button className={styles.retryBtn} onClick={refetch}>
            Повторить
          </button>
        </div>
      )}

      {orders && orders.length === 0 && (
        <div className={styles.center}>
          <p className={styles.emptyText}>Заказов пока нет</p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className={styles.list}>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={() => navigate(orderDetailPath(order.id))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
