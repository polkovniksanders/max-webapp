import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@app/store'
import { PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/config/routes'
import { useBackButton } from '@shared/hooks/useBackButton'
import { buildImageUrl } from '@entities/product'
import {
  addItem,
  removeItem,
  updateQuantity,
  useUpdateCartMutation,
  useDeleteCartMutation,
  type CartItem,
} from '@entities/cart'
import { toast } from '@shared/lib'
import { PromocodeSection } from '@features/cart'
import { getShopId } from '@shared/config/shopId'
import { getMessengerUserId } from '@shared/config/userId'
import styles from './CartPage.module.css'

/**
 * Trash icon SVG — used inside the delete button and as the decrement
 * button icon when the current quantity is 1 (removing the item entirely).
 */
const TrashIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
)

/**
 * Single cart row — renders product image, title, prices, a divider,
 * then a bottom controls row with a delete icon on the left and a
 * primary-pill stepper on the right.
 *
 * Layout (matches reference CartItem.tsx + ProductCard.tsx pattern):
 * ```
 * [72px img]  [title — 2 lines]
 *             [old_price ~~]  [price bold]
 * ────────────────────────────────────────
 * [🗑 icon]                    [−  N  +]
 * ```
 *
 * @param item - Cart item from Redux store
 */
const CartRow = ({ item }: { item: CartItem }) => {
  const dispatch = useDispatch()
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation()
  const [deleteCart, { isLoading: isDeleting }] = useDeleteCartMutation()

  const shopId = getShopId()
  const userId = getMessengerUserId()

  /** True while any network operation for this row is in flight */
  const isLoading = isUpdating || isDeleting

  const handleIncrement = async () => {
    const prevQty = item.quantity
    const newQty = prevQty + 1
    dispatch(updateQuantity({ productId: item.productId, quantity: newQty }))
    try {
      await updateCart({
        messenger_user_id: userId,
        shop_id: shopId,
        product_id: item.productId,
        quantity: newQty,
      }).unwrap()
    } catch {
      dispatch(updateQuantity({ productId: item.productId, quantity: prevQty }))
      toast.error('Не удалось обновить количество')
    }
  }

  const handleDecrement = async () => {
    if (item.quantity <= 1) {
      dispatch(removeItem(item.productId))
      if (item.cartItemId) {
        try {
          await deleteCart({ id: item.cartItemId, messenger_user_id: userId, shop_id: shopId }).unwrap()
        } catch {
          dispatch(addItem(item))
          toast.error('Не удалось удалить товар')
        }
      }
    } else {
      const prevQty = item.quantity
      const newQty = prevQty - 1
      dispatch(updateQuantity({ productId: item.productId, quantity: newQty }))
      try {
        await updateCart({
          messenger_user_id: userId,
          shop_id: shopId,
          product_id: item.productId,
          quantity: newQty,
        }).unwrap()
      } catch {
        dispatch(updateQuantity({ productId: item.productId, quantity: prevQty }))
        toast.error('Не удалось обновить количество')
      }
    }
  }

  const handleRemove = async () => {
    dispatch(removeItem(item.productId))
    if (item.cartItemId) {
      try {
        await deleteCart({ id: item.cartItemId, messenger_user_id: userId, shop_id: shopId }).unwrap()
      } catch {
        dispatch(addItem(item))
        toast.error('Не удалось удалить товар')
      }
    }
  }

  const imageUrl = buildImageUrl(item.imageFile)
  const hasOldPrice = item.old_price !== null && item.old_price > item.price
  const qtyLabel = `${item.quantity}шт`

  return (
    <div className={styles.cartRow}>
      {/* ── Product info: image | [title, then qty+price row] ── */}
      <div className={styles.productInfo}>
        <div className={styles.productImageWrapper}>
          {imageUrl ? (
            <img src={imageUrl} alt={item.title} className={styles.productImg} />
          ) : (
            <div className={styles.productImagePlaceholder} />
          )}
        </div>

        <div className={styles.productDetails}>
          <p className={styles.productTitle}>{item.title}</p>

          {/* Bottom meta row: "1шт" left | old price + current price right */}
          <div className={styles.productMeta}>
            <span className={styles.qtyText}>{qtyLabel}</span>
            <div className={styles.priceBlock}>
              {hasOldPrice && (
                <span className={styles.oldPrice}>
                  {item.old_price!.toLocaleString('ru-RU')} ₽
                </span>
              )}
              <span className={styles.price}>
                {item.price.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className={styles.divider} />

      {/* ── Controls: trash left | stepper right ── */}
      <div className={styles.controlsRow}>
        <button
          className={styles.deleteBtn}
          onClick={handleRemove}
          disabled={isLoading}
          aria-label="Удалить товар"
        >
          <TrashIcon />
        </button>

        <div className={styles.stepper}>
          <button
            className={styles.stepperBtn}
            onClick={handleDecrement}
            disabled={isLoading}
            aria-label="Уменьшить количество"
          >
            <span>−</span>
          </button>

          <span className={styles.stepperCount}>
            {isLoading ? '·' : item.quantity}
          </span>

          <button
            className={styles.stepperBtn}
            onClick={handleIncrement}
            disabled={isLoading}
            aria-label="Увеличить количество"
          >
            <span>+</span>
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Invoice / order summary card — shown below the items list.
 *
 * Row order (matches reference Invoice.tsx):
 *   1. Товары         — oldPriceTotal (or originalTotal when no old prices exist)
 *   2. Скидка         — only when oldPriceTotal > originalTotal (green)
 *   3. Промокод       — only when a promocode is applied (green)
 *   ─────────────────────────────────────────────────────────────
 *   4. Итого          — effectiveTotal, always shown, bold + larger font
 *
 * @param originalTotal      - Sum of item.price × item.quantity for all items
 * @param oldPriceTotal      - Sum of (item.old_price ?? item.price) × item.quantity
 * @param oldPriceDiscount   - oldPriceTotal − originalTotal (positive = discount)
 * @param promocodeDiscount  - originalTotal − appliedPromocode.discountedTotal
 * @param effectiveTotal     - Final amount after all discounts
 * @param hasPromocode       - Whether a promocode is currently applied
 */
const InvoiceSection = ({
  originalTotal,
  oldPriceTotal,
  oldPriceDiscount,
  promocodeDiscount,
  effectiveTotal,
  hasPromocode,
}: {
  originalTotal: number
  oldPriceTotal: number
  oldPriceDiscount: number
  promocodeDiscount: number
  effectiveTotal: number
  hasPromocode: boolean
}) => {
  const hasOldPriceDiscount = oldPriceDiscount > 0

  return (
    <div className={styles.invoice}>
      {/* Row 1: Товары — show the "before discount" total when old prices exist */}
      <div className={styles.invoiceRow}>
        <span className={styles.invoiceLabel}>Товары</span>
        <span className={styles.invoiceValue}>
          {(hasOldPriceDiscount ? oldPriceTotal : originalTotal).toLocaleString('ru-RU')} ₽
        </span>
      </div>

      {/* Row 2: Скидка — only rendered when old_price discount exists */}
      {hasOldPriceDiscount && (
        <div className={styles.invoiceRow}>
          <span className={styles.invoiceLabel}>Скидка</span>
          <span className={`${styles.invoiceValue} ${styles.invoiceDiscount}`}>
            −{oldPriceDiscount.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      )}

      {/* Row 3: Промокод — only rendered when a validated promocode is applied */}
      {hasPromocode && promocodeDiscount > 0 && (
        <div className={styles.invoiceRow}>
          <span className={styles.invoiceLabel}>Промокод</span>
          <span className={`${styles.invoiceValue} ${styles.invoiceDiscount}`}>
            −{promocodeDiscount.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      )}

      {/* Separator before the Итого row */}
      <div className={styles.invoiceSeparator} />

      {/* Row 4: Итого — always visible, larger + bolder */}
      <div className={`${styles.invoiceRow} ${styles.invoiceTotalRow}`}>
        <span className={styles.invoiceTotalLabel}>Итого</span>
        <span className={styles.invoiceTotalValue}>
          {effectiveTotal.toLocaleString('ru-RU')} ₽
        </span>
      </div>
    </div>
  )
}

/**
 * Cart page — displays all items in the cart with quantity controls,
 * a promocode section, and the full invoice summary.
 *
 * Reads from the Redux `cart` slice which holds both `items` (populated
 * by optimistic updates or `hydrateCart` on session start) and
 * `appliedPromocode` (set by `PromocodeSection` when a code is validated).
 *
 * Discount tiers (in order of application):
 *   1. old_price per-product discounts → reduces the "Товары" subtotal
 *   2. Promocode → further reduces the post-old_price-discount subtotal
 *
 * The bottom checkout button always reflects `effectiveTotal` (after all
 * applied discounts), never the raw sum.
 */
export const CartPage = () => {
  const navigate = useNavigate()
  useBackButton()

  const items = useAppSelector((state) => state.cart.items)
  const appliedPromocode = useAppSelector((state) => state.cart.appliedPromocode)

  /**
   * Sum of each item's actual sale price × quantity.
   * This is the base before any promocode.
   */
  const originalTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  /**
   * Sum using old_price where available (i.e. the "was" price).
   * When old_price is null we fall back to the current price so the
   * arithmetic is still correct.
   */
  const oldPriceTotal = items.reduce(
    (acc, item) => acc + (item.old_price ?? item.price) * item.quantity,
    0,
  )

  /** Positive value means a per-product discount is in play. */
  const oldPriceDiscount = oldPriceTotal - originalTotal

  /**
   * How much the promocode saves over originalTotal.
   * Zero when no promocode is applied.
   */
  const promocodeDiscount = appliedPromocode ? originalTotal - appliedPromocode.discountedTotal : 0

  /**
   * Effective total shown in the invoice and the checkout button.
   * Applies the backend-validated discounted total when a promocode
   * is active; falls back to the sale-price sum otherwise.
   */
  const effectiveTotal = appliedPromocode?.discountedTotal ?? originalTotal
    console.log(items)
  return (
    <div className={styles.page}>
      <PageHeader title="Корзина" />

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <svg
            className={styles.emptyIcon}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="32" cy="32" r="32" fill="#f5f5f5" />
            <path
              d="M20 22h3l4 18h14l3-12H27"
              stroke="#c7c7c7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="28" cy="44" r="2" fill="#c7c7c7" />
            <circle cx="38" cy="44" r="2" fill="#c7c7c7" />
          </svg>
          <p className={styles.emptyText}>Корзина пуста</p>
          <p className={styles.emptySubtext}>Добавьте товары, чтобы оформить заказ</p>
        </div>
      ) : (
        <div className={styles.itemsList}>
          {items.map((item) => (
            <CartRow key={item.productId} item={item} />
          ))}
        </div>
      )}

      {items.length > 0 && (
        <>
          {/* Promocode entry — placed between the items list and the summary */}
          <div className={styles.promocodeWrapper}>
            <PromocodeSection originalTotal={originalTotal} />
          </div>

          <InvoiceSection
            originalTotal={originalTotal}
            oldPriceTotal={oldPriceTotal}
            oldPriceDiscount={oldPriceDiscount}
            promocodeDiscount={promocodeDiscount}
            effectiveTotal={effectiveTotal}
            hasPromocode={appliedPromocode !== null}
          />
        </>
      )}

      <div className={styles.bottomBar}>
        <button
          className={styles.checkoutBtn}
          disabled={items.length === 0}
          onClick={() => navigate(ROUTES.CHECKOUT_CONTACT)}
        >
          {items.length === 0 ? 'Корзина пуста' : 'Оформить заказ'}
        </button>
      </div>
    </div>
  )
}
