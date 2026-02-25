import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@app/store'
import { addItem, updateQuantity } from '@entities/cart'
import { setSelectedProduct, CATEGORIES } from '@entities/product'
import type { CategoryId } from '@entities/product'
import { MOCK_PRODUCTS } from '@shared/mocks/products'
import { ROUTES } from '@shared/config/routes'
import styles from './ShopMainPage.module.css'

export const ShopMainPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')

  const shop = useSelector((state: RootState) => state.shop.shop)
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const filtered =
    activeCategory === 'all'
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.categoryId === activeCategory)

  const getCartItem = (productId: number) =>
    cartItems.find((i) => i.product.id === productId)

  const handleProductClick = (productId: number) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId)
    if (product) {
      dispatch(setSelectedProduct(product))
      navigate(ROUTES.PRODUCT.replace(':id', String(productId)))
    }
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.shopLogo}>{shop.name[0]}</div>
          <div>
            <div className={styles.shopName}>{shop.name}</div>
            <div className={styles.shopDesc}>{shop.description}</div>
          </div>
        </div>
        <button className={styles.cartBtn} onClick={() => navigate(ROUTES.CART)}>
          <CartIcon />
          {totalCount > 0 && <span className={styles.cartBadge}>{totalCount}</span>}
        </button>
      </header>

      {/* Banner */}
      <div className={styles.banner}>
        <img src={shop.bannerImage} alt="Баннер магазина" className={styles.bannerImg} />
        <div className={styles.bannerOverlay}>
          <div className={styles.bannerTitle}>Весенняя распродажа</div>
          <div className={styles.bannerSubtitle}>До –35% на популярные товары</div>
        </div>
      </div>

      {/* Categories */}
      <div className={styles.categoriesWrap}>
        <div className={styles.categories}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.catBtn} ${activeCategory === cat.id ? styles.catBtnActive : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className={styles.grid}>
        {filtered.map((product) => {
          const cartItem = getCartItem(product.id)
          return (
            <div key={product.id} className={styles.card}>
              <div className={styles.cardImg} onClick={() => handleProductClick(product.id)}>
                <img src={product.image} alt={product.title} className={styles.img} />
                {product.discount > 0 && (
                  <span className={styles.discountBadge}>–{product.discount}%</span>
                )}
              </div>
              <div className={styles.cardBody} onClick={() => handleProductClick(product.id)}>
                <div className={styles.cardTitle}>{product.title}</div>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{product.price.toLocaleString('ru-RU')} ₽</span>
                  {product.oldPrice && (
                    <span className={styles.oldPrice}>
                      {product.oldPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.cardFooter}>
                {cartItem ? (
                  <div className={styles.counter}>
                    <button
                      className={styles.counterBtn}
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: product.id,
                            quantity: cartItem.quantity - 1,
                          }),
                        )
                      }
                    >
                      –
                    </button>
                    <span className={styles.counterVal}>{cartItem.quantity}</span>
                    <button
                      className={styles.counterBtn}
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: product.id,
                            quantity: cartItem.quantity + 1,
                          }),
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles.addBtn}
                    onClick={() => dispatch(addItem(product))}
                  >
                    В корзину
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
)
