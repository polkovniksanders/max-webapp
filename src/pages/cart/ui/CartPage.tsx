import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@app/store'
import { PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/config/routes'
import { useBackButton } from '@shared/hooks/useBackButton'
import { buildImageUrl } from '@entities/product'
import {
  removeItem,
  updateQuantity,
  useUpdateCartMutation,
  useDeleteCartMutation,
  type CartItem,
} from '@entities/cart'
import { getShopId } from '@shared/config/shopId'
import { getMessengerUserId } from '@shared/config/userId'
import styles from './CartPage.module.css'

/**
 * Single cart row — renders product image, title, price and quantity controls.
 * Handles optimistic Redux update + API sync independently.
 *
 * @param item - Cart item from Redux store
 */
const CartRow = ({ item }: { item: CartItem }) => {
  const dispatch = useDispatch()
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation()
  const [deleteCart, { isLoading: isDeleting }] = useDeleteCartMutation()

  const shopId = getShopId()
  const userId = getMessengerUserId()
  const isLoading = isUpdating || isDeleting

  const handleIncrement = async () => {
    const newQty = item.quantity + 1
    // Optimistic update
    dispatch(updateQuantity({ productId: item.productId, quantity: newQty }))
    await updateCart({ messenger_user_id: userId, shop_id: shopId, product_id: item.productId, quantity: newQty })
  }

  const handleDecrement = async () => {
    if (item.quantity <= 1) {
      // Remove from store immediately, then sync API
      dispatch(removeItem(item.productId))
      if (item.cartItemId) {
        await deleteCart({ id: item.cartItemId, messenger_user_id: userId, shop_id: shopId })
      }
    } else {
      const newQty = item.quantity - 1
      dispatch(updateQuantity({ productId: item.productId, quantity: newQty }))
      await updateCart({ messenger_user_id: userId, shop_id: shopId, product_id: item.productId, quantity: newQty })
    }
  }

  const handleRemove = async () => {
    dispatch(removeItem(item.productId))
    if (item.cartItemId) {
      await deleteCart({ id: item.cartItemId, messenger_user_id: userId, shop_id: shopId })
    }
  }

  const imageUrl = buildImageUrl(item.imageFile)
  const totalPrice = (item.price * item.quantity).toLocaleString('ru-RU')

  return (
    <div className={styles.cartRow}>
      <div className={styles.cartRowImage}>
        {imageUrl ? (
          <img src={imageUrl} alt={item.title} className={styles.productImage} />
        ) : (
          <div className={styles.productImagePlaceholder} />
        )}
      </div>

      <div className={styles.cartRowContent}>
        <p className={styles.productTitle}>{item.title}</p>

        <div className={styles.cartRowFooter}>
          <span className={styles.productPrice}>{totalPrice} ₽</span>

          <div className={styles.quantityControls}>
            <button
              className={styles.qtyBtn}
              onClick={handleDecrement}
              disabled={isLoading}
              aria-label="Уменьшить количество"
            >
              {item.quantity === 1 ? (
                /* Trash icon when quantity would drop to zero */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              ) : (
                <span>−</span>
              )}
            </button>

            <span className={styles.qtyValue}>{item.quantity}</span>

            <button
              className={styles.qtyBtn}
              onClick={handleIncrement}
              disabled={isLoading}
              aria-label="Увеличить количество"
            >
              <span>+</span>
            </button>
          </div>
        </div>
      </div>

      <button
        className={styles.deleteBtn}
        onClick={handleRemove}
        disabled={isLoading}
        aria-label="Удалить товар"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

/**
 * Cart page — displays all items in the cart with quantity controls and total sum.
 *
 * Reads directly from the Redux `cart.items` slice which is populated either
 * by `useCartItem.add()` (optimistic) or by `hydrateCart()` on app mount
 * (from the backend on session start).
 *
 * Empty state is shown when the slice is empty.
 */
export const CartPage = () => {
  const navigate = useNavigate()
  useBackButton()

  const items = useAppSelector((state) => state.cart.items)

  const totalSum = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className={styles.page}>
      <PageHeader title="Корзина" />

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="#f5f5f5" />
            <path d="M20 22h3l4 18h14l3-12H27" stroke="#c7c7c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>
              {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}
            </span>
            <span className={styles.summaryValue}>{totalSum.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      )}

      <div className={styles.bottomBar}>
        <button
          className={styles.checkoutBtn}
          disabled={items.length === 0}
          onClick={() => navigate(ROUTES.CHECKOUT_CONTACT)}
        >
          {items.length === 0
            ? 'Корзина пуста'
            : `Оформить заказ · ${totalSum.toLocaleString('ru-RU')} ₽`}
        </button>
      </div>
    </div>
  )
}
