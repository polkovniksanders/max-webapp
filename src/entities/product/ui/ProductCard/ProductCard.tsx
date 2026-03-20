import { buildImageUrl } from '../../model/apiTypes'
import type { ApiProduct } from '../../model/apiTypes'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: ApiProduct
  onClick: () => void
  cartQuantity?: number
  cartLoading?: boolean
  onAddToCart?: (e: React.MouseEvent) => void
  onIncrement?: (e: React.MouseEvent) => void
  onDecrement?: (e: React.MouseEvent) => void
}

export const ProductCard = ({
  product,
  onClick,
  cartQuantity = 0,
  cartLoading = false,
  onAddToCart,
  onIncrement,
  onDecrement,
}: ProductCardProps) => (
  <div className={styles.card} onClick={onClick}>
    <div className={styles.imgWrap}>
      {product.images[0]?.file ? (
        <img
          src={buildImageUrl(product.images[0].file)}
          alt={product.title}
          className={styles.img}
        />
      ) : (
        <div className={styles.imgPlaceholder} />
      )}
      {product.discount > 0 && (
        <span className={styles.discountBadge}>–{product.discount}%</span>
      )}
    </div>

    <div className={styles.body}>
      <div className={styles.priceRow}>
        <span className={styles.price}>{product.price.toLocaleString('ru-RU')} ₽</span>
        {product.old_price && (
          <span className={styles.oldPrice}>{product.old_price.toLocaleString('ru-RU')} ₽</span>
        )}
      </div>
      <p className={styles.title}>{product.title}</p>

      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
        {cartQuantity > 0 ? (
          <div className={styles.stepper}>
            <button className={styles.stepBtn} onClick={onDecrement} disabled={cartLoading}>
              −
            </button>
            <span className={styles.stepQty}>{cartQuantity}</span>
            <button className={styles.stepBtn} onClick={onIncrement} disabled={cartLoading}>
              +
            </button>
          </div>
        ) : (
          <button
            className={styles.addToCartBtn}
            disabled={cartLoading}
            onClick={(e) => { e.stopPropagation(); onAddToCart?.(e) }}
          >
            {cartLoading ? '...' : 'В корзину'}
          </button>
        )}
      </div>
    </div>
  </div>
)

