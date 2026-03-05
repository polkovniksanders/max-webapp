import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useGetProductQuery, buildImageUrl } from '@entities/product'
import { addItem } from '@entities/cart'
import type { RootState } from '@app/store'
import { useBackButton } from '@shared/hooks/useBackButton'
import { SkeletonBlock, SkeletonLine } from '@shared/ui'
import { ROUTES } from '@shared/config/routes'
import styles from './ProductPage.module.css'

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { data: product, isLoading, isError } = useGetProductQuery(Number(id), { skip: !id })
  const isInCart = useSelector((state: RootState) =>
    state.cart.items.some((i) => i.productId === Number(id)),
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

  const handleCartBtn = () => {
    if (isInCart) {
      navigate(ROUTES.CART)
      return
    }
    dispatch(
      addItem({
        productId: product.id,
        title: product.title,
        price: product.price,
        old_price: product.old_price,
        imageFile: product.images?.[0]?.file ?? null,
        quantity: 1,
      }),
    )
  }

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

      {/* Sticky кнопка корзины */}
      <div className={styles.bottomBar}>
        <button className={`${styles.cartBtn} ${isInCart ? styles.cartBtnInCart : ''}`} onClick={handleCartBtn}>
          {isInCart ? 'Перейти в корзину' : 'Добавить в корзину'}
        </button>
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
