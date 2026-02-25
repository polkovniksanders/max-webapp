import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@app/store'
import { setSelectedProduct } from '@entities/product'
import { addItem, updateQuantity } from '@entities/cart'
import { MOCK_PRODUCTS } from '@shared/mocks/products'
import { getWebApp } from '@shared/bridge'
import styles from './ProductPage.module.css'

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const product = useSelector((state: RootState) => state.product.selectedProduct)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const cartItem = cartItems.find((i) => i.product.id === product?.id)

  // Если продукт не в Redux (прямой переход по URL) — восстановить из мока
  useEffect(() => {
    if (!product && id) {
      const found = MOCK_PRODUCTS.find((p) => p.id === Number(id))
      if (found) {
        dispatch(setSelectedProduct(found))
      } else {
        navigate(-1)
      }
    }
  }, [product, id, dispatch, navigate])

  // BackButton через MAX Bridge
  useEffect(() => {
    const webApp = getWebApp()
    webApp?.BackButton.show()
    webApp?.BackButton.onClick(() => navigate(-1))
    return () => {
      webApp?.BackButton.hide()
      webApp?.BackButton.offClick(() => navigate(-1))
    }
  }, [navigate])

  if (!product) return null

  return (
    <div className={styles.page}>
      {/* Кнопка назад (фолбэк для дева без BackButton) */}
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <BackIcon /> Назад
      </button>

      {/* Фото */}
      <div className={styles.imageWrap}>
        <img src={product.image} alt={product.title} className={styles.image} />
        {product.discount > 0 && (
          <span className={styles.discountBadge}>–{product.discount}%</span>
        )}
      </div>

      {/* Контент */}
      <div className={styles.content}>
        <h1 className={styles.title}>{product.title}</h1>

        {/* Цена */}
        <div className={styles.priceRow}>
          <span className={styles.price}>{product.price.toLocaleString('ru-RU')} ₽</span>
          {product.oldPrice && (
            <span className={styles.oldPrice}>
              {product.oldPrice.toLocaleString('ru-RU')} ₽
            </span>
          )}
          {product.discount > 0 && (
            <span className={styles.savings}>
              Экономия {(product.oldPrice! - product.price).toLocaleString('ru-RU')} ₽
            </span>
          )}
        </div>

        {/* Описание */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Описание</div>
          <p className={styles.description}>{product.description}</p>
        </div>

        {/* Характеристики */}
        {Object.keys(product.attributes).length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Характеристики</div>
            <div className={styles.attrs}>
              {Object.entries(product.attributes).map(([key, value]) => (
                <div key={key} className={styles.attrRow}>
                  <span className={styles.attrKey}>{key}</span>
                  <span className={styles.attrDots} />
                  <span className={styles.attrVal}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom bar */}
      <div className={styles.bottomBar}>
        {cartItem ? (
          <div className={styles.counter}>
            <button
              className={styles.counterBtn}
              onClick={() =>
                dispatch(
                  updateQuantity({ productId: product.id, quantity: cartItem.quantity - 1 }),
                )
              }
            >
              –
            </button>
            <span className={styles.counterVal}>{cartItem.quantity} шт.</span>
            <button
              className={styles.counterBtn}
              onClick={() =>
                dispatch(
                  updateQuantity({ productId: product.id, quantity: cartItem.quantity + 1 }),
                )
              }
            >
              +
            </button>
          </div>
        ) : (
          <button className={styles.addBtn} onClick={() => dispatch(addItem(product))}>
            В корзину · {product.price.toLocaleString('ru-RU')} ₽
          </button>
        )}
      </div>
    </div>
  )
}

const BackIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
