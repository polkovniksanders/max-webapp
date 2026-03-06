import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetProductQuery, buildImageUrl } from '@entities/product'
import { useCartItem } from '@entities/cart'
import { useBackButton } from '@shared/hooks/useBackButton'
import { SkeletonBlock, SkeletonLine } from '@shared/ui'
import { ROUTES } from '@shared/config/routes'
import styles from './ProductPage.module.css'

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: product, isLoading, isError } = useGetProductQuery(Number(id), { skip: !id })

  const { quantity, isLoading: isCartLoading, add, increment, decrement } = useCartItem(
    product
      ? {
          id: product.id,
          title: product.title,
          price: product.price,
          old_price: product.old_price,
          imageFile: product.images?.[0]?.file ?? null,
        }
      : { id: 0, title: '', price: 0, old_price: null, imageFile: null },
  )

  const [attrsOpen, setAttrsOpen] = useState(true)

  useBackButton()

  useEffect(() => {
    if (isError) navigate(-1)
  }, [isError, navigate])

  if (isLoading) {
    return (
      <div className={styles.page}>
        <SkeletonBlock aspectRatio="3/4" />
        <div className={styles.content}>
          <SkeletonLine width="75%" height={22} />
          <SkeletonLine width="40%" height={30} />
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine width="60%" />
        </div>
      </div>
    )
  }

  if (!product) return null

  const imageUrl = buildImageUrl(product.images?.[0]?.file)
  const discount = product.discount ?? 0
  const hasAttrs = product.attributes && Object.keys(product.attributes).length > 0

  return (
    <div className={styles.page}>
      {/* Фото */}
      {imageUrl && (
        <div className={styles.imageWrap}>
          <img src={imageUrl} alt={product.title} className={styles.image} />
          {discount > 0 && <span className={styles.discountBadge}>–{discount}%</span>}
        </div>
      )}

      {/* Контент */}
      <div className={styles.content}>
        <h1 className={styles.title}>{product.title}</h1>

        <div className={styles.priceRow}>
          <span className={styles.price}>{product.price.toLocaleString('ru-RU')} ₽</span>
          {product.old_price && (
            <span className={styles.oldPrice}>
              {product.old_price.toLocaleString('ru-RU')} ₽
            </span>
          )}
        </div>

        {product.description && (
          <p
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br>') }}
          />
        )}

        {hasAttrs && (
          <div className={styles.attrsSection}>
            <button
              className={styles.attrsToggle}
              onClick={() => setAttrsOpen((v) => !v)}
            >
              <ChevronIcon open={attrsOpen} />
              <span>Все характеристики</span>
            </button>

            {attrsOpen && (
              <div className={styles.attrs}>
                {Object.entries(product.attributes!).map(([key, value]) => (
                  <div key={key} className={styles.attrRow}>
                    <span className={styles.attrKey}>{key}</span>
                    <span className={styles.attrDots} />
                    <span className={styles.attrVal}>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      <div className={styles.bottomBar}>
        {quantity > 0 ? (
          <div className={styles.bottomBarRow}>
            <div className={styles.stepper}>
              <button
                className={styles.stepBtn}
                onClick={decrement}
                disabled={isCartLoading}
              >
                −
              </button>
              <span className={styles.stepQty}>{quantity}</span>
              <button
                className={styles.stepBtn}
                onClick={increment}
                disabled={isCartLoading}
              >
                +
              </button>
            </div>
            <button
              className={`${styles.cartBtn} ${styles.cartBtnInCart}`}
              onClick={() => navigate(ROUTES.CART)}
            >
              В корзину
            </button>
          </div>
        ) : (
          <button
            className={styles.cartBtn}
            onClick={add}
            disabled={isCartLoading}
          >
            {isCartLoading ? '...' : 'Добавить в корзину'}
          </button>
        )}
      </div>
    </div>
  )
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
