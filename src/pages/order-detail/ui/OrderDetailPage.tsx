import { useParams, useNavigate } from 'react-router-dom'
import { useGetOrderQuery, type ApiOrder, type ApiOrderItem } from '@entities/order'
import { useBackButton } from '@shared/hooks/useBackButton'
import { PageHeader } from '@shared/ui'
import styles from './OrderDetailPage.module.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Human-readable labels for order status slugs returned by the API. */
const STATUS_LABEL: Record<string, string> = {
  new: 'Новый',
  processing: 'В обработке',
  completed: 'Выполнен',
  cancelled: 'Отменён',
  paid: 'Оплачен',
}

/**
 * Returns a CSS class modifier for a given order status slug so the badge
 * can be coloured contextually (green for success, red for cancelled, etc.).
 */
function statusModifier(status: string): string {
  switch (status) {
    case 'completed':
    case 'paid':
      return styles.statusSuccess
    case 'cancelled':
      return styles.statusError
    default:
      return styles.statusDefault
  }
}

/**
 * Formats an ISO date string to localised `DD.MM.YYYY HH:MM`.
 *
 * @param iso - ISO 8601 date string from the API.
 * @returns Formatted date string, or em-dash on parse failure.
 */
function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * Renders a single `label / value` info row used in the meta section.
 */
const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className={styles.infoRow}>
    <span className={styles.infoLabel}>{label}</span>
    <span className={styles.infoValue}>{value}</span>
  </div>
)

/**
 * Renders one line item inside the product list section of an order.
 *
 * Displays the product name, quantity badge, unit price, and line total.
 */
const ProductRow = ({ item }: { item: ApiOrderItem }) => {
  const lineTotal = (item.price * item.quantity).toLocaleString('ru-RU')
  const unitPrice = item.price.toLocaleString('ru-RU')

  return (
    <div className={styles.productRow}>
      <div className={styles.productMeta}>
        <span className={styles.productTitle}>{item.product_title}</span>
        <span className={styles.productUnit}>{unitPrice} ₽ / шт.</span>
      </div>
      <div className={styles.productRight}>
        <span className={styles.productQtyBadge}>× {item.quantity}</span>
        <span className={styles.productLineTotal}>{lineTotal} ₽</span>
      </div>
    </div>
  )
}

/**
 * Skeleton placeholder for the order-detail page while data is loading.
 * Mirrors the visual structure of the real content to minimise layout shift.
 */
const DetailSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.skeletonHeader} />
    <div className={styles.section}>
      <div className={styles.skeletonLine} style={{ width: '60%' }} />
      <div className={styles.skeletonLine} style={{ width: '40%' }} />
      <div className={styles.skeletonLine} style={{ width: '55%' }} />
    </div>
    <div className={styles.section}>
      <div className={styles.skeletonLine} />
      <div className={styles.skeletonLine} />
      <div className={styles.skeletonLine} style={{ width: '80%' }} />
    </div>
  </div>
)

// ─── Main content ─────────────────────────────────────────────────────────────

/**
 * Renders the full detail view of a loaded order.
 *
 * @param order - Fully loaded `ApiOrder` object from RTK Query.
 */
const OrderDetailContent = ({ order }: { order: ApiOrder }) => {
  const itemCount = order.items.length
  const itemWord = itemCount === 1 ? 'товар' : itemCount < 5 ? 'товара' : 'товаров'

  return (
    <div className={styles.content}>
      {/* ── Header card: order id + status badge ── */}
      <div className={styles.section}>
        <div className={styles.orderHeadRow}>
          <span className={styles.orderId}>Заказ #{order.id}</span>
          <span className={`${styles.statusBadge} ${statusModifier(order.status)}`}>
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </div>
      </div>

      {/* ── Meta info: date, item count, total ── */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Информация о заказе</p>
        <InfoRow label="Дата" value={formatDate(order.created_at)} />
        <InfoRow label="Позиций" value={`${itemCount} ${itemWord}`} />
      </div>

      {/* ── Product list ── */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Состав заказа</p>
        <div className={styles.productList}>
          {order.items.map((item, idx) => (
            <div key={item.id}>
              <ProductRow item={item} />
              {idx < order.items.length - 1 && <div className={styles.divider} />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Total ── */}
      <div className={`${styles.section} ${styles.totalSection}`}>
        <span className={styles.totalLabel}>Итого</span>
        <span className={styles.totalAmount}>
          {order.total_price.toLocaleString('ru-RU')} ₽
        </span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * Order detail page — fetches a single order by `orderId` URL param and
 * renders its full breakdown: status, product list with quantities/prices,
 * and the grand total.
 *
 * Uses `useGetOrderQuery` (non-lazy) so RTK Query handles the fetch
 * automatically on mount. The `skip` guard prevents a request when the param
 * is absent (should not happen in practice given the router config).
 *
 * Navigation: `useBackButton()` wires the MAX Bridge native back button so
 * users can return to the orders list from the platform chrome.
 */
export const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  useBackButton()

  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useGetOrderQuery(Number(orderId), { skip: !orderId })

  // ── Loading state ──
  if (isLoading) {
    return (
      <>
        <PageHeader title="Заказ" />
        <DetailSkeleton />
      </>
    )
  }

  // ── Error state ──
  if (isError) {
    return (
      <div className={styles.page}>
        <PageHeader title="Заказ" />
        <div className={styles.center}>
          <p className={styles.errorText}>Не удалось загрузить заказ</p>
          <button className={styles.retryBtn} onClick={() => refetch()}>
            Повторить
          </button>
          <button className={styles.backLink} onClick={() => navigate(-1)}>
            Назад к заказам
          </button>
        </div>
      </div>
    )
  }

  // ── Not found (API returned nothing) ──
  if (!order) {
    return (
      <div className={styles.page}>
        <PageHeader title="Заказ" />
        <div className={styles.center}>
          <p className={styles.errorText}>Заказ не найден</p>
          <button className={styles.backLink} onClick={() => navigate(-1)}>
            Назад к заказам
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader title={`Заказ #${order.id}`} />
      <OrderDetailContent order={order} />
    </div>
  )
}
