import { buildImageUrl } from '../../model/apiTypes'
import type { ApiProduct } from '../../model/apiTypes'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: ApiProduct
  onClick: () => void
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => (
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
      <button className={styles.addToCartBtn} onClick={(e) => e.stopPropagation()}>
        В корзину
      </button>
    </div>
  </div>
)
